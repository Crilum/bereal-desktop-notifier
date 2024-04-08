#!/bin/bash

systemctl --user stop bereal-desktop-notifier.service
systemctl --user disable bereal-desktop-notifier.service
rm -rf $HOME/.config/systemd/user/bereal-desktop-notifier.service $HOME/.local/bin/bereal-desktop-notifier $HOME/.local/share/bereal-desktop-notifier/
systemctl --user daemon-reload
echo "Done!"