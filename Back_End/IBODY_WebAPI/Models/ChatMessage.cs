using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace IBODY_WebAPI.Models
{
    public class ChatMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
