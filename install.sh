#!/bin/bash

if ! command -v node &>/dev/null; then
    echo "I can't find a Node.js binary!! Please install Node.js.
Exiting..."
    exit 1
elif ! command -v cvlc &>/dev/null; then
    echo "I can't find a cvlc binary!! Please install cvlc.
Exiting..."
    exit 1
elif ! command -v npm &>/dev/null; then
    echo "I can't find a npm binary!! Please install npm.
Exiting..."
    exit 1
elif [[ ! $(pwd) ~= "bereal-desktop-notifier" ]]; then
    echo "Please run this script from the \`bereal-desktop-notifier\` directory."
elif [[ $(cat ./index.js | grep "const key = ") == 'const key = ""; // get an API key from https://bereal.devin.fun/' ]]; then
    echo "Please enter an API key in the \`index.js\` file. This program will not work without it!!
You can get an API key at https://bereal.devin.fun/"
    exit 1
fi

npm i

cd ..
mkdir -p $HOME/.local/share/
mkdir -p $HOME/.config/systemd/user/
cp -r bereal-desktop-notifier/ $HOME/.local/share/

echo "#!/bin/bash
cd $HOME/.local/share/bereal-desktop-notifier/
node ./index.js" | tee $HOME/.local/bin/bereal-desktop-notifier >/dev/null
chmod +x $HOME/.local/bin/bereal-desktop-notifier

echo "[Unit]
Description=BeReal Desktop Notifier

[Service]
ExecStart=/usr/bin/bash $HOME/.local/bin/bereal-desktop-notifier
Type=exec
Restart=always

[Install]
WantedBy=default.target" | tee $HOME/.config/systemd/user/bereal-desktop-notifier.service &>/dev/null

systemctl --user daemon-reload
systemctl --user enable bereal-desktop-notifier.service
systemctl --user start bereal-desktop-notifier.service

if [[ $(systemctl --user is-enabled bereal-desktop-notifier.service) != "enabled" ]]; then
    echo "Oops!! The BeReal Desktop Notifier service isn't enabled! I'm not sure what happened..
BeReal Desktop Notifier *is* installed, but something weird happened while trying to enable the service. You can run it manually with this command:
/bin/bash cd $HOME/.local/share/bereal-desktop-notifier/ && node ./index.js"
    exit 1
fi

echo "Done!
Installed to \`$HOME/.local/share/bereal-desktop-notifier/\`.
BeReal Desktop Notifier will be started on boot as a systemd service. You can also run it manually with this command:
/bin/bash cd $HOME/.local/share/bereal-desktop-notifier/ && node ./index.js"