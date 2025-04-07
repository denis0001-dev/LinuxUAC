#!/bin/bash

pkcommand=$(which pkexec)

mv "$pkcommand" "$pkcommand.bak"

cat << "FEOF" > "$pkcommand"
#!/bin/bash
cat << SEOF > /tmp/uac_askpass.sh
\#!/bin/bash
command=$(echo "$@" | sed -E "s/^$/\/bin\/bash/gm;t")
uac "--app=\$command"
SEOF
chmod +x /tmp/uac_askpass.sh
SUDO_ASKPASS=/tmp/uac_askpass.sh sudo -A $@
code=$?
rm /tmp/uac_askpass.sh
exit $code
FEOF
chmod +x "$pkcommand"