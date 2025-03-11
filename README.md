# myClassroom

### Distraction-free platform for focused selfstudy

This is a webapp to create courses from youtube playlists. Design own courses, study without any ads or distractions. Track course progress, to-do, goals, study hours.

---

### **Technologies Used**

1. `backend:`

- flask
- yt_dlp
- jwt authentication [flask_jwt_extend]
- CORS [flask_cors]

2. `database:`

- mongoDB
- ORM: flask_pymongo

3. `frontend:`

- React
- TailwindCSS

---

### **Installation Guide**

> Note: Make sure **python**, **node** & **mongoDB** is installed in your system.

First clone the repository using `https` or `ssh`

- https

```zsh
git clone https://github.com/Dream-World-Coder/myClassroom.git
```

- ssh

```zsh
git clone git@github.com:Dream-World-Coder/myClassroom.git
```

Now go to the `myClassroom` folder

```zsh
cd myClassroom
```

Now install packages for the <u>frontend part (client)</u>

```zsh
cd client
pnpm install
```

or

```zsh
npm install
```

this will create the `node_modules` folder.

Now start the frontend using pnpm or npm

```zsh
pnpm dev
# or
npm run dev
```

Now that frontend is done, lets go towards <u>backend(server)</u>

First start the mongoDB server:
for Mac using HomeBrew:

```zsh
brew services start mongodb-community
```

Now go to server folder using `cd ../server`
make a virtual environment of any name, here I am using `.venv` name.

for linux & apple:

```zsh
python3 -m venv .venv
source .venv/bin/activate
```

for windows:

```zsh
python -m venv .venv
source .venv/bin/activate
```

now install the packages:

```zsh
pip install -r requirements.txt
```

cretate a .env file

```zsh
echo "PORT=5050
SECRET_KEY="any:string"
SQLALCHEMY_DATABASE_URI="sqlite:///database.sqlite"
MONGO_URI="mongodb://localhost:27017/flaskStudyWebsite"
DEV_DATABASE_URL="mongodb://localhost:27017/flaskStudyWebsite_dev"
TEST_DATABASE_URL="mongodb://localhost:27017/flaskStudyWebsite_test"
PROD_DATABASE_URL="mongodb://localhost:27017/flaskStudyWebsite_prod"
" >> .env
```

> change the database name as you wish

now run the flask server:

```zsh
python run.py
# or using gunicorn
gunicorn run:app --workers 4 --threads 2
```

Now your webapp is running, visit `localhost:5173` in your browser.
Or `127.0.0.1:5173` if you encounter CORS error.

For Mac you can simply use:

- give premission to execute:

```zsh
chmod +x start_app.sh
chmod +x stop_app.sh
```

- for starting the app

```zsh
./start_app.sh
```

- for stopping the app

```zsh
./stop_app.sh
```

### Directory Structure

```txt
.
├── LICENSE
├── README.md
├── client
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.app.json
│   ├── jsconfig.json
│   ├── package.json
│   ├── public
│   ├── src
│   ├── tailwind.config.js
│   ├── to-do.txt
│   └── vite.config.js
├── images
│   ├── add-course.png
│   ├── courses.png
│   ├── home.png
│   ├── stats.png
│   └── vid.png
├── server
│   ├── Procfile
│   ├── _main
│   ├── helper.py
│   ├── instance
│   ├── myClassroom
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── run.py
├── start_app.sh
└── stop_app.sh
```

---

### Notes:

1. It takes time to create a course, the range lies between 10 seconds - 10 minutes approximately based on the playlist size. Actually yt_dlp takes a long time to extract the information from videos, so no need to think its not working, just be a little patient. **Be sure to create a pull request if you find a way to make it faster.**

2. playlist needs to be public.

3. Currently its objective is not concurrency or performance, focus is to create an application for personal use, so not optimised for public deployment.

---

---

### TO-DOs:

_Be sure to submit a PR if you add these mentioned features or any other_

- [ ] Study material add
- [ ] lectures watch track

---

---

### **preview**

![img](./images/home.png)
![img](./images/stats.png)
![img](./images/add-course.png)
![img](./images/courses.png)
![img](./images/vid.png)
