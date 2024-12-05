#!/bin/bash
crond
echo "* * * * * root npm run db:reset && npm run seed >> /var/log/cron.log 2>&1" >/etc/crontabs/root && chmod 0644 /etc/crontabs/root
