namespace chat.Models;

public record Message(string UserName, string Text, DateTime SentAt);
