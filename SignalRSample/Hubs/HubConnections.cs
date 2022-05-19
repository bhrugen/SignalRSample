namespace SignalRSample.Hubs
{
    public static class HubConnections
    {
        //userid = connectionid
        public static Dictionary<string, List<string>> Users = new();

        public static bool HasUserConnection(string UserId, string ConnectionId)
        {
            try
            {
                if (Users.ContainsKey(UserId))
                {
                    return Users[UserId].Any(p => p.Contains(ConnectionId));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return false;
        }

        public static bool HasUser(string UserId)
        {
            try
            {
                if (Users.ContainsKey(UserId))
                {
                    return Users[UserId].Any();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return false;
        }

        public static void AddUserConnection(string UserId, string ConnectionId)
        {

            if (!string.IsNullOrEmpty(UserId) && !HasUserConnection(UserId, ConnectionId))
            {
                if (Users.ContainsKey(UserId))
                    Users[UserId].Add(ConnectionId);
                else
                    Users.Add(UserId, new List<string> { ConnectionId });
            }
        }

        public static List<string> OnlineUsers()
        {
            return Users.Keys.ToList();
        }

    }
}
