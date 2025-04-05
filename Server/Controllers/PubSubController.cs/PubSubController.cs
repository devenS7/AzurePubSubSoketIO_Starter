
using Microsoft.AspNetCore.Mvc;
using Azure.Messaging.WebPubSub;

[ApiController]
[Route("api")]
public class WebPubSubController : ControllerBase
{
    private readonly WebPubSubServiceClient _webPubSubServiceClient; private readonly ILogger<WebPubSubController> _logger;

    public WebPubSubController(IConfiguration config, ILogger<WebPubSubController> logger) { var connectionString = config["WebPubSubConnectionString"]; var hubName = config["HubName"]; _webPubSubServiceClient = new WebPubSubServiceClient(connectionString, hubName); _logger = logger; }

    [HttpGet("negotiate")]
    public IActionResult Negotiate()
    {
        try
        {
            var uri = _webPubSubServiceClient.GetClientAccessUri(userId: "Dev"); var correctUrl = uri.AbsoluteUri.Replace("/client/hubs/socketio", "/clients/socketio/hubs/socketio"); _logger.LogInformation($"Negotiated URL: {correctUrl}");

            return Ok(new { url = correctUrl });
        }
        catch (Exception ex) { _logger.LogError($"Negotiation error: {ex.Message}"); return StatusCode(500, "Error generating negotiation URL."); }
    }

    // API is no longer needed to send messages since we are using WebSockets directly}

}
