#!/bin/bash

pkcommand=$(which pkexec)

mv "$pkcommand" "$pkcommand.bak"

cat << "EOF" > "$pkcommand"
#!/bin/bash
echo "#!/bin/bash" > /tmp/uac_askpass.sh
echo "uac \"--app=$@\"" >> /tmp/uac_askpass.sh
chmod +x /tmp/uac_askpass.sh
SUDO_ASKPASS=/tmp/uac_askpass.sh sudo -A $@
rm /tmp/uac_askpass.sh
EOF

chmod +x "$pkcommand"