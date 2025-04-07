#!/bin/bash

pkcommand=$(which pkexec)

mv "$pkcommand" "$pkcommand.bak"

cat << "FEOF" > "$pkcommand"
#!/bin/bash

echo "#!/bin/bash" > /tmp/uac_askpass.sh
echo "command=$(echo "$@" | sed -E 's/^$/\/bin\/bash/gm;t')" >> /tmp/uac_askpass.sh
echo "uac \"--app=\$command\"" >> /tmp/uac_askpass.sh

chmod +x /tmp/uac_askpass.sh
SUDO_ASKPASS=/tmp/uac_askpass.sh sudo -A $@
code=$?
rm /tmp/uac_askpass.sh
exit $code
FEOF
chmod +x "$pkcommand"