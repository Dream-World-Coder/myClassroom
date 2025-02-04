from myClassroom import create_app, mongo
from myClassroom.models import User
import os

app = create_app()

@app.shell_context_processor
def make_shell_context():
  return {
    "mongo": mongo,
    "User": User
  }


if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5050))
  app.run(host="0.0.0.0", port=port)
