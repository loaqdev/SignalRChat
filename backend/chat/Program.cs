using chat.Hubs;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddStackExchangeRedisCache(options =>
{
    var connectionString = Environment.GetEnvironmentVariable("RedisConnection")
                           ?? builder.Configuration.GetConnectionString("Redis")
                           ?? "localhost:6379";

    options.Configuration = connectionString;
    options.ConfigurationOptions = new ConfigurationOptions
    {
        EndPoints = { connectionString },
        AbortOnConnectFail = false,
        ConnectTimeout = 10000,
        ConnectRetry = 5
    };
});

var app = builder.Build();

app.UseCors();
app.MapHub<ChatHub>("/chat");
app.Run();