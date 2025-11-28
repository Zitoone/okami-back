import nodemailer from 'nodemailer'

export const sendFormEmail = async (req, res) => {

    console.log("sendFormEmail appelé");
    console.log("Données reçues :", req.body);

    const { name, email, object, message } = req.body;

    if (!name || !email || !message) {
        console.warn("Champs obligatoires manquants");
        return res.status(400).json({ success: false, message: "Les champs nom, email et message sont requis" });
    }

    try {
        console.log("Création du transporteur Nodemailer avec : ", {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            user: process.env.MAIL_USER ? "OK" : "NON DEFINI"
        });

        const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

/* transporter.verify((err, success) => {
  if (err) console.log("Erreur SMTP:", err);
  else console.log("Connexion SMTP OK");
}); */


        console.log("Préparation des options email");
        const mailOptions = {
            from: `"Okami Festival Contact Form" <${process.env.MAIL_USER}>`,
            to: 'olivia@okamifestival.com',
            replyTo: email,
            subject: `Nouveau message de ${name}`,
            text: `
                Nom: ${name}
                Email: ${email}
                Objet: ${object || ""}
                Message: ${message}
            `,
              html: `
    <h2 style="color:#c23f3f;">Nouveau message depuis le site Okami Festival 🎉</h2>
    <p><strong>Nom :</strong> ${name}</p>
    <p><strong>Email :</strong> ${email}</p>
    <p><strong>Objet :</strong> ${object || "—"}</p>
    <p><strong>Message :</strong><br>${message.replace(/\n/g, "<br>")}</p>
    <hr>
    <p style="font-size:0.9em;color:#777;">Envoyé automatiquement depuis le formulaire de contact du site Okami Festival</p>
  `
        };

        console.log("Envoi de l'email...");
        const info = await transporter.sendMail(mailOptions);

        console.log("Email envoyé avec succès: ", info.response);

        res.json({ success: true, message: "Email envoyé!" });
    } catch (error) {
        console.error("Erreur envoi mail :", error);
        if (error && error.response) console.error("Détail SMTP :", error.response);
        res.status(500).json({ success: false, message: "Erreur envoi mail" });
    }
}


//TODO: Mettre en place Brevo au mieu de Nodemailer + gmail pour + de fiabilité