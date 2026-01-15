
import os

class Config:
    """
    Holds the application's configuration loaded from environment variables.
    """
    def __init__(self):
        self.gcp_project_id = os.environ.get("GCP_PROJECT_ID")
        if not self.gcp_project_id:
            raise ValueError("GCP_PROJECT_ID environment variable not set")

        self.executor_topic_id = os.environ.get("EXECUTOR_TOPIC_ID")
        if not self.executor_topic_id:
            raise ValueError("EXECUTOR_TOPIC_ID environment variable not set")
            
        self.vertex_ai_model = os.environ.get("VERTEX_AI_MODEL", "gemini-2.5-flash")

cfg = Config()
