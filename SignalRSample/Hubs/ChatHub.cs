using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessageToAll(string user, string message)
        {
            await Clients.All.SendAsync("MessageReceived", user, message);
        }

    }
}
