module.exports = require('./_build_go')(
  process.env.SERVER,
  'https://github.com/7binary/go-auth.git',
  'go-auth',
);

/*
0. sudo su
1. nano /lib/systemd/system/go-auth.service
[Unit]
Description=go-auth

[Service]
WorkingDirectory=/home/webuser/go-auth/current
ExecStart=/home/webuser/go-auth/current/go-auth
Type=simple
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target

3. systemctl daemon-reload
4. systemctl start go-auth
5. systemctl enable go-auth
6. systemctl status go-auth

7. nano /etc/nginx/sites-available/go-auth
server {
    server_name go-auth.zin.is;
    location / {
        proxy_pass http://localhost:1323;
    }
}
8. ln -sf /etc/nginx/sites-available/go-auth /etc/nginx/sites-enabled/go-auth
8. nginx -t
9. service nginx restart

10. certbot --nginx -d go-auth.zin.is
 */
