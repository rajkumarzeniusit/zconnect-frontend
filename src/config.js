// const config = {
//   chatApiBaseUrl: "http://127.0.0.1:8005",
//   //chatServerBaseUrl: "http://127.0.0.1:8000",
//   chatWebSocketUrl: "ws://localhost:9000",
//   environment: "development",
//   featureFlag: true,
//   socketurl:"http://localhost:8000",
//   rejectedmails:"http://localhost:8000/store_rejected_emails",
//   skills:'http://localhost:8000/skills',
//   agentstatus:"http://localhost:3003/Set-Agent-Status",//redis
//   agentsapi:`http://localhost:8005/agents`,//redis
//   chatiframe:"http://localhost:3005/",//redis
//   messagesapi:"http://localhost:8005/messages",//redis
//   agents:"http://localhost:8005/agents",//redis
//   emailtemplates:"http://10.16.7.113:8080/api/email_templates/",
// };

const config = {
  chatApiBaseUrl1: "http://127.0.0.1:9000",
  chatApiBaseUrl: "http://127.0.0.1:8005",
  chatWebSocketUrl: "ws://localhost:9000",
  environment: "development",
  featureFlag: true,
  socketurl:"http://localhost:8000",
  rejectedmails:"http://localhost:8000/store_rejected_emails",
  skills:'http://localhost:8000/skills',
  agentstatus:"http://localhost:3003/Set-Agent-Status",//redis
  agentsapi:`http://localhost:8005/agents`,//redis
  chatiframe:"http://localhost:3005/",//redis
  messagesapi:"http://localhost:8005/messages",//redis
  agents:"http://localhost:8005/agents",//redis
  emailtemplates:"http://10.16.7.113:8080/api/email_templates/",
};

export default config;
