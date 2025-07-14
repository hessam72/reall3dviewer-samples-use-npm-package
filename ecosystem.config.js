module.exports = {
    apps: [
        {
            name: 'PLY-car-App',
            script: 'npm',
            args: 'run start',
            env: {
                PORT: 3019, // Set the port for this instance
                NODE_ENV: 'production',
            },
        },
    ],
};
// pm2 start ecosystem.config.js
// /var/www/vhosts/omidcity.com/zima.omidcity.com
// /var/www/vhosts/omidcity.com/hadis.omidcity.com

// ln -s /etc/nginx/sites-available/ar.omidcity.com /etc/nginx/sites-enabeld/ar.omidcity.com
// sudo ln -s /etc/nginx/sites-available/civil.omidcity.com /etc/nginx/sites-enabled/
// sudo certbot --nginx -d civil.omidcity.com -d www.civil.omidcity.com
