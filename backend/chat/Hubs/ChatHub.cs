using chat.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace chat.Hubs;

public interface IChatClient
{
    Task ReceiveMessage(Message message);
}

public class ChatHub : Hub<IChatClient>
{
    private readonly IDistributedCache _cache;

    public ChatHub(IDistributedCache cache) => _cache = cache;

    public async Task JoinChat(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);
        var stringConnection = JsonSerializer.Serialize(connection);
        var cacheOptions = new DistributedCacheEntryOptions
        {
            SlidingExpiration = TimeSpan.FromHours(1)
        };
        await _cache.SetStringAsync(Context.ConnectionId, stringConnection, cacheOptions);
        await Clients.Group(connection.ChatRoom).ReceiveMessage(new Message("Admin", $"{connection.UserName} joined the {connection.ChatRoom}", DateTime.UtcNow));
    }

    public async Task SendMessage(string messageText)
    {
        var stringConnection = await _cache.GetStringAsync(Context.ConnectionId);
        if (!string.IsNullOrEmpty(stringConnection))
        {
            var connection = JsonSerializer.Deserialize<UserConnection>(stringConnection);
            if (connection is not null)
            {
                var messageDto = new Message(connection.UserName, messageText, DateTime.UtcNow);
                await Clients.Group(connection.ChatRoom).ReceiveMessage(messageDto);
            }
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var stringConnection = await _cache.GetStringAsync(Context.ConnectionId);
        if (!string.IsNullOrEmpty(stringConnection))
        {
            var connection = JsonSerializer.Deserialize<UserConnection>(stringConnection);
            if (connection is not null)
            {
                await _cache.RemoveAsync(Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, connection.ChatRoom);
                await Clients.Group(connection.ChatRoom).ReceiveMessage(new Message("Admin", $"{connection.UserName} left the chat.", DateTime.UtcNow));
            }
        }
        await base.OnDisconnectedAsync(exception);
    }
}