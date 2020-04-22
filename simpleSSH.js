const SSH = require("simple-ssh");
const ssh = new SSH({
        host: "node-13.rosti.cz",
        user: "app",
        pass: "-------",
        port: 16347
    });
ssh.on('error', function(err) {
    console.log('[!] Error :',err);
    ssh.end();
});
ssh.start();
ssh.exec("ls", { // log: app, conf, logs, run, var
    out: function (stdout){
        console.log(stdout);
    }
});
