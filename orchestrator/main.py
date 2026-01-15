
import base64
import json
import os

from flask import Flask, request

from pkg.orchestrator import service

app = Flask(__name__)

@app.route("/", methods=["POST"])
def index():
    """
    This is the main entry point for the Pub/Sub push subscription.
    It receives messages, decodes them, and passes them to the orchestrator service.
    """
    envelope = request.get_json()
    if not envelope:
        msg = "no Pub/Sub message received"
        print(f"error: {msg}")
        return f"Bad Request: {msg}", 400

    if not isinstance(envelope, dict) or "message" not in envelope:
        msg = "invalid Pub/Sub message format"
        print(f"error: {msg}")
        return f"Bad Request: {msg}", 400

    pubsub_message = envelope["message"]

    if isinstance(pubsub_message, dict) and "data" in pubsub_message:
        try:
            data = json.loads(base64.b64decode(pubsub_message["data"]).decode("utf-8"))
            print(f"Received opportunity: {data}")
            
            # Process the message using the orchestrator service
            service.process_opportunity(data)

        except Exception as e:
            print(f"Error processing message: {e}")
            return "Error processing message", 500

    return "OK", 204


if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=PORT, debug=True)
