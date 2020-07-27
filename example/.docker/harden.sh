#!/bin/sh

# Be informative after successful login.
echo -e "\n\nApp container image built on $(date)." > /etc/motd

# Remove existing crontabs, if any.
rm -fr /var/spool/cron
rm -fr /etc/crontabs
rm -fr /etc/periodic

# Remove fstab since we do not need it.
rm -f /etc/fstab
