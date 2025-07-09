from myClassroom import create_app, mongo
from myClassroom.models import User
import os

app = create_app(configs_dictionary_key="_")

@app.shell_context_processor
def make_shell_context():
  return {
    "mongo": mongo,
    "User": User
  }


if __name__ == "__main__":
  port = int(os.environ.get("PORT", 3000))
  app.run(port=port)
