using IBODY_WebAPI.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IBODY_WebAPI.Services
{
    public class ChatMessageService
    {
        private readonly IMongoCollection<ChatMessage> _collection;

        public ChatMessageService(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            var db = client.GetDatabase(config["MongoDB:Database"]);
            _collection = db.GetCollection<ChatMessage>(config["MongoDB:Collection"]);
        }

        public async Task AddMessage(ChatMessage msg) => await _collection.InsertOneAsync(msg);

        public async Task<List<ChatMessage>> GetMessages(int user1, int user2)
        {
            var filter = Builders<ChatMessage>.Filter.Or(
                Builders<ChatMessage>.Filter.And(
                    Builders<ChatMessage>.Filter.Eq(m => m.FromUserId, user1),
                    Builders<ChatMessage>.Filter.Eq(m => m.ToUserId, user2)
                ),
                Builders<ChatMessage>.Filter.And(
                    Builders<ChatMessage>.Filter.Eq(m => m.FromUserId, user2),
                    Builders<ChatMessage>.Filter.Eq(m => m.ToUserId, user1)
                )
            );

            return await _collection.Find(filter).SortBy(m => m.Timestamp).ToListAsync();
        }

        public async Task DeleteMessageById(string id)
        {
            var filter = Builders<ChatMessage>.Filter.Eq(m => m.Id, id);
            await _collection.DeleteOneAsync(filter);
        }

        public async Task DeleteConversation(int user1, int user2)
        {
            var filter = Builders<ChatMessage>.Filter.Or(
                Builders<ChatMessage>.Filter.And(
                    Builders<ChatMessage>.Filter.Eq(m => m.FromUserId, user1),
                    Builders<ChatMessage>.Filter.Eq(m => m.ToUserId, user2)
                ),
                Builders<ChatMessage>.Filter.And(
                    Builders<ChatMessage>.Filter.Eq(m => m.FromUserId, user2),
                    Builders<ChatMessage>.Filter.Eq(m => m.ToUserId, user1)
                )
            );
            await _collection.DeleteManyAsync(filter);
        }
    }
}
