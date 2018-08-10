# Digital Document Archive Application

A web based application used for the document archive in the Ministry of Social Securities in Kosovo.

- User roles.
- Manage users.
- Manage documents.
- Easily find and filter documents.
- Check if document is already added based on requested criteria.
- Reports page, generate reports based on filter criteria.
- Add and attach subdocuments to document.
- Email document directly from web client.
- Forgot password recovery with token through email.
- Activity logs for superadmin.

## Technologies used:
 * Server: **Node.js**
 * Backend Framework: **Express.js**
 * Database: **Mongodb**
 * ORM: **Mongoose**
 * Frontend: **jQuery**
 * Responsive Interface: **Bootstrap**
 * Web Service API: **REST**

## Getting Started
The instructions will help you set up the project in a server machine.

### Prerequisites
 * Ubuntu
 * Nodejs 8.10.0
 * MongoDB 3.6
 * Nginx
 * Git
 * PM2

### Installation

#### Install nodejs with package manager:
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

To compile and install native addons from npm you may also need to install build tools:
```
sudo apt-get install -y build-essential
```

#### Install Mongodb:
1. Import the public key used by the package management sytem:
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
```

2. Create a list file for MongoDB
Ubuntu 16.04:
```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
```

3. Reaload local package database
```
sudo apt-get update
```

4. Install the MongoDB packages
```
sudo apt-get install -y mongodb-org
```

5. Enable service to start on startup
```
systemctl enable mongod.service
```

#### Install git:
```
sudo apt-get install git
```

#### (Developement only)
If you are going to use the project for developement, don't install further tools, instead go ahead clone the project:
```
git clone https://github.com/opendatakosovo/aprk-archive-app.git
```

Change directory
```
cd aprk-archive-app
```
Install dependecies
```
npm install
```
Seed the database
```
node seed/superadmin.js
```
Create the uploads dir
```
mkdir public/uploads
```
Run the application
```
node app.js
```

#### (Production only)
Skip developement part and install the following tools if you are preparing for a production server deployment
#### Install Nginx:
1. Install with the apt packaging system
```
sudo apt-get update
sudo apt-get install nginx
```

2. Adjust the firewall
It is recommended that you enable the most restrictive profile that will still allow the traffic you've configured. We will only need to allow traffic on port 80.
```
sudo ufw allow 'Nginx HTTP'
```
You can verify the change by typing
```
sudo ufw status
```

3. Check your web server
At the end of the installation process Ubuntu starts Nginx. The web server should already be up and running.
We can check with the systemd init system to make sure the service is running by typing:
```
systemctl status nginx
```


#### Install PM2:
Now install PM2, which is a process manager for Node.js applications. PM2 provides an easy way to manage and daemonize applications (run them in the background as a service).
```
sudo npm install -g pm2
```

The startup subcommand generates and configures a startup script to launch PM2 and its managed processes on server boots:
```
pm2 startup systemd
```



#### Get the project:
Change directory to /var/www/
```
cd /var/www
```

Clone the project with git:
```
git clone https://github.com/opendatakosovo/aprk-archive-app.git
```

Change directory in project directory
```
cd aprk-archive-app
```

Install the node modules
```
npm install
```

Create folder in /public for uploads
```
cd public
mkdir uploads
```


#### Set up nginx and run the server
Go back in project root folder
```
cd ..
```

Run seed for superadmin user
```
node seed/superadmin.js
```

Run the project with pm2
```
pm2 start app.js
```

Open the nginx default config file for editing:
```
sudo nano /etc/nginx/sites-available/default
```

Within the server block you should have an existing location / block. Replace the contents of that block with the following configuration. If your application is set to listen on a different port, update the highlighted portion to the correct port number.

```
. . .
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

```

This configures the server to respond to requests at its root. Assuming our server is available at example.com, accessing https://example.com/ via a web browser would send the request to app.js, listening on port 8080 at localhost.

Once you are done adding the location blocks for your applications, save and exit.

Configure the file upload limit
```
#Edit this file:
sudo nano /etc/nginx/nginx.conf

#Add this line inside the http block:
client_max_body_size 5M;

#Then restart Nginx
sudo service nginx restart
```

Make sure you didn't introduce any syntax errors by typing:
```
sudo nginx -t
```

Next, restart Nginx:
```
sudo systemctl restart nginx
```










