export const metadata = { title: 'Politique de confidentialité - Gros Mall' }
export default function Privacy() {
  return (<article className="card max-w-3xl mx-auto space-y-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
    <h1 className="text-3xl font-black">Politique de confidentialité</h1><p className="text-sm text-gray-500">Dernière mise à jour : 21 novembre 2026</p>
    <p>Gros Mall est une place de marché de vente en gros au Maroc. Cette page explique quelles données nous utilisons et pourquoi.</p>
    <h2>1. Données collectées</h2><ul><li>Compte : nom, email, mot de passe (stocké chiffré par notre prestataire d'authentification), téléphone, ville.</li><li>Commandes : produits, quantités, montant, adresse de livraison, téléphone, statut.</li><li>Vendeurs : produits publiés (nom, description, prix, stock, photos).</li><li>Photos : les images que vous choisissez (galerie ou appareil photo) pour vos produits. L'application n'accède pas à votre appareil photo ni à votre galerie en dehors de cette action.</li></ul>
    <h2>2. Pourquoi nous les utilisons</h2><p>Créer et sécuriser votre compte, afficher les produits, traiter et livrer les commandes, permettre au vendeur de vous contacter pour votre commande, et répondre à vos demandes.</p>
    <h2>3. Partage</h2><p>Nous ne vendons jamais vos données. Une commande transmet votre nom de commande, téléphone et adresse au vendeur concerné. Nous utilisons des prestataires techniques : Supabase (base de données et authentification), Cloudinary (images) et Vercel (hébergement).</p>
    <h2>4. Cookies et stockage local</h2><p>Nous utilisons uniquement le stockage de votre navigateur pour la session de connexion, le panier et le fonctionnement hors ligne. Aucun cookie publicitaire ni de suivi.</p>
    <h2>5. Conservation et suppression</h2><p>Vos données sont conservées tant que votre compte existe. Vous pouvez supprimer votre compte et vos données à tout moment depuis la page <a className="underline font-bold" href="/supprimer-compte">Supprimer mon compte</a>.</p>
    <h2>6. Vos droits</h2><p>Vous pouvez accéder à vos données, les corriger ou les supprimer (loi marocaine 09-08). Écrivez-nous pour toute demande.</p>
    <h2>7. Enfants</h2><p>Gros Mall n'est pas destiné aux moins de 18 ans.</p>
    <h2>8. Contact</h2><p><a className="underline font-bold" href="mailto:contact@grosmall.ma">contact@grosmall.ma</a></p></article>)
}
