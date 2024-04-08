# bereal-desktop-notifier

_Get BeReal notifications on your desktop!_

### Installation:
#### Prerequisites:
- You must have `node.js` installed. (At least version 18, this script uses the Fetch API)
  - Since this is a `node.js` project, you'll need `npm` to install packages.
- You must have `cvlc` (CLI VLC Media Player) installed. (on Red Hat/Fedora based systems, `sudo dnf in cvlc`)

#### Download and prepare install script:
```
git clone https://github.com/Crilum/bereal-desktop-notifier
cd bereal-desktop-notifier/
chmod +x install.sh
```

<br>

**IMPORTANT:**

Add your [API key](https://bereal.devin.fun/) to the script:

![image](https://github.com/Crilum/bereal-desktop-notifier/assets/91354257/ece14fbf-abd8-4c3b-893e-d0fef77c7b6a)

The script will not work without an API key from https://bereal.devin.fun/.

<br>

#### Run install script:
```
./install.sh
```

The install script will copy the repository to `$HOME/.local/share/`, and create a systemd service to start the program on boot.

It will also create a script in `$HOME/.local/bin/` for starting the program manually (run `bereal-desktop-notifier` in your terminal).
