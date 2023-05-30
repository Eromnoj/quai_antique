# Le Quai Antique
## _Projet réalisé dans le cadre de l'évaluation en cours de formation au sein de l'organisme STUDI_

## Présentation du projet
Dans le cadre de ma formation avec STUDI, j'ai dû réaliser un site vitrine pour un restaurant, pouvant gérer des comptes clients, un compte d'administrateur qui a la main sur une gallerie d'image, une présentation des plats et des menus, ainsi qu'une interface de réservation en ligne.

Je vais ici présenter les différentes étapes de déploiement pour pouvoir tester le projet localement. 

Le projet final a été deployé en ligne et est accessible en cliquant sur le lien suivant : [Le Quai Antique](https://ecf.jomoreschi.fr)

La Charte Graphique du sujet peut être téléchargée ici : [Charte Graphique](https://github.com/Eromnoj/quai_antique/raw/main/charte_graphique.pdf)

La documentation technique du sujet peut être téléchargée ici : [Documentation Technique](https://github.com/Eromnoj/quai_antique/raw/main/documentation_technique.pdf)

Lien vers le logiciel de gestion de projet Trello : [Trello](https://trello.com/invite/b/7kdIA0wP/ATTIaeed5af8c0ed411f3f0eb709e4faee505DE91DBD/le-quai-antique)

# Deploiement du projet
## Préparation de l'environnement
Le projet a été développé en utilisant le framework Symfony, en version 6.2, ainsi qu'un système de gestion de base de données relationnelle Mysql en version 8.0. 
Mon environnement de développement se trouve sur WSL2 (Windows Subsystem for Linux) avec un système Ubuntu 20.04LTS. Les étapes d'installations des prérequis seront donc valides pour n'importe quel système linux de type Debian. 
Cependant une installation de type XAMPP est tout à fait utilisable, assurez-vous cependant de respecter les prérequis de version de PHP, 8.1 étant la version minimale à utiliser pour la version 6.2 de Symfony.
Pour créer une interface d'administration dynamique, les composants React proposé par Symfony ont été utilisé, l'installation de la dernière version LTS de nodejs devra aussi être effectué. 

#### Prérequis
- Git
- PHP 8.1
- Mysql 8.0
- Composer
- Symfony-cli
- NodeJS 16.14
- Nginx ou Apache2(optionnel, comme le déploiement en local se fait à des fins de test, le serveur de développement de symfony pourra être utilisé)

### Installation des prérequis sous Windows
L'installation des prérequis sous Windows se fait grâce au téléchargement des différents éxécutables de chaque composants. Vous trouverez ici les liens vers les pages de téléchargements. Référez-vous aux documentations officielles pour plus d'informations.
- [GIT](https://gitforwindows.org/)
- [XAMPP](https://www.apachefriends.org/fr/download.html)
- [Composer](https://getcomposer.org/download/)
- [Symfony-cli](https://symfony.com/download)
- [NODEJS](https://nodejs.org/en/)

### Installation des prérequis sous Ubuntu
#### Mettre à jour son sytème
```
sudo apt update && apt upgrade
```

#### Installation de Git
```
sudo apt install git
```
#### Installation de PHP et des dépendances nécessaires au fonctionnement de symfony

```
sudo apt install software-properties-common
sudo apt-add-repository ppa:ondrej/php
sudo apt update 
sudo apt install php php-fpm php-mbstring php-xml php-curl php-zip
```
#### Installation de MySQL et du driver correspondant pour PHP
```
sudo apt install mysql-server php-mysql
```
Sécuriser l'installation pour pouvoir utiliser mysql (création d'un mot de passe root, nettoyer les tables de test, etc). Entrez cette commande, et suivez les instructions.

```
sudo mysql_secure_installation
```
> Cette étape peut échouer et vous afficher l'erreur suivante :
```
 Failed! Error: SET PASSWORD has no significance for user 'root'@'localhost' ...
```
> En cas d'erreur, une solution se trouve ici : [nixcraft](https://www.nixcraft.com/t/mysql-failed-error-set-password-has-no-significance-for-user-root-localhost-as-the-authentication-method-used-doesnt-store-authentication-data-in-the-mysql-server-please-consider-using-alter-user/4233)

#### Installation de composer
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === '55ce33d7678c5a611085589f1f3ddf8b3c52d662cd01d4ba75c0ee0459970c2200a51f492d557530c71c15d8dba01eae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```
#### Installation de symfony-cli
```
curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | sudo -E bash
sudo apt install symfony-cli
```
#### Installation de nodeJS
```
sudo apt install nodejs npm
```

#### Installations optionnelles du serveur web NGinx ou Apache2
A cette étape, vous pouvez choisir entre NGinx et Apache. En environnement de développement, cette installation n'est pas indispensable puisque nous pouvons utiliser le serveur fournit par symfony. En production il est préférable d'utiliser l'une ou l'autre des options. Pour leur configuration spécifique à Symfony, consultez la [documentation](https://symfony.com/doc/current/setup/web_server_configuration.html)

Installation de Nginx : 
```
sudo apt install nginx
```
Installation de Apache2 :
```
sudo apt install apache2 libapache2-mod-php
```

## Installation du projet

### Verification de l'environnement Symfony
Avant de procéder à l'installation du projet en local, veuillez vous assurer que l'environnement symfony est correctement installé en tapant la commande suivante :
```
symfony check:requirements
```
Veuillez corriger les éventuelles erreurs en installant les dépendances manquantes signalées par l'outils.

### Récupération du projet en utilisant Git
Placez vous dans le dossier devant receptionner le projet et tapez la commande suivante :
```
git clone https://github.com/Eromnoj/quai_antique.git
```
Et placez vous dans le dossier du projet 
```
cd quai_antique
```
### Installation des dépendances
Pour installer les dépendances nécessaires au fonctionnement du site, tapez les commandes suivantes :

- Installation des dépendances symfony
```
composer install
```

- Installation des dépendances node
```
npm install
```

### Modifiez les variables d'environnement
Créez un fichier .env.local avec les variables d'environnement sous cette forme :
- ##### Définir l'environnement sous prod (pour desactiver le debogage)
```
APP_ENV=prod
```
- ##### Définir un SECRET 

Doit être une chaîne de 32 caractères aléatoire. Avec openssl, une chaine de caratères peut être générée en tapant la commande : ```openssl rand -hex 32``` 
```
APP_SECRET=***chaineUltraSecreteEtUnique***
```

- ##### Lien vers la base de donnée (modifier avec les informations adéquates permettant le lien avec votre base de donnée)
```
DATABASE_URL="mysql://<user>:<password>@<address>:<port>/<nomBDD>?serverVersion=8&charset=utf8mb4"
```
- ##### Information pour l'envoie de mail

Le projet envoie des mails à deux occasions : pour la récupération du mot de passe ainsi que pour confirmer une réservation.
Pour cela, le service d'envoi de mail de [Sendgrid](https://sendgrid.com/) a été utilisé. Mais le mailer par défaut de symfony peut être utilisé en utilisant un serveur SMTP ([Documentation symfony](https://symfony.com/doc/current/mailer.html)). Dans le cas où aucune adresse mail n'aurait pas été fournie, les envois de mail sont désactivés en intégrant un bloc trycatch. Si vous n'intégrez pas d'adresse mail lors du test en local, l'envoi de mail est fonctionnelle sur le site déployé en exemple, et peut y être testée.
```
MAILER_DSN=smtp://user:pass@smtp.example.com:25
EMAIL_ADDR="votre@email.fr"
```
### Déployer la base de donnée et les fixtures

Pour déployer la base de données, les outils proposés par doctrine au sein de Symfony seront utilisés. Tapez les commandes suivantes :
- ##### Créer la base de donnée, ainsi que les tables
```
# Créer la base de donnée
php bin/console doctrine:database:create
#déployer les migrations
php bin/console doctrine:migrations:migrate
```
- ##### alimenter la base de donnée avec les fixtures
```
APP_ENV=dev php bin/console doctrine:fixtures:load
```

L'alimentation de la base de donnée avec les fixtures n'est pas obligatoires. Les vérifications nécessaires pour avoir une base de données avec les informations minimales sont faites au niveau des controllers de l'application :
- Méthode permettant d'avoir des horaires sur 7 jours : [populateSchedule](https://github.com/Eromnoj/quai_antique/blob/d49319d6cdcb0364d2467b154b4fb6bcde08a4e9/src/Repository/ScheduleRepository.php#L91-L117). la suppression des horaires n'est pas possible, mais en cas de mauvaises manipulations de la base de donnée, ceci permet d'avoir une réinitialisation.
- Premier utilisateur inscrit toujours administrateur ([register](https://github.com/Eromnoj/quai_antique/blob/cb831352ed70f8380bf5c51afd46275793dca300/src/Controller/RegistrationController.php#L37-L57)) ([isUserFirstSuscriber](https://github.com/Eromnoj/quai_antique/blob/cb831352ed70f8380bf5c51afd46275793dca300/src/Repository/UserRepository.php#L64-L73)) ([form](https://github.com/Eromnoj/quai_antique/blob/f64135aa843063e8d37b155dbd677d12e4aa7e1d/src/Form/RegistrationFormType.php#L64-L125)) ([template](https://github.com/Eromnoj/quai_antique/blob/f64135aa843063e8d37b155dbd677d12e4aa7e1d/templates/registration/register.html.twig#L52-L120)), et le compte administrateur ne peut pas être supprimé ([delete_client](https://github.com/Eromnoj/quai_antique/blob/cb831352ed70f8380bf5c51afd46275793dca300/src/Controller/ApiController.php#L1404-L1416))

Cependant, sans les fixtures, les tables concernant la gallerie d'image, les plats, les menus et les réservations ne seront pas alimentées, et devront être fournies pendant les tests.

### Build du front-end React
Toutes les pages d'administration (restaurant, client), ont été construites grâce aux composants React. l'utilisation du bundle webpack encore de symfony permet de transpiler les composants pour pouvoir être déployer. Pour se faire, tapez la commande suivante, à la racine du projet :
```
npm run build
```

### Nettoyer le cache
Par mesure de précaution, nettoyer le cache :
```
php bin/console cache:clear
```

### Lancer le projet
Pour lancer le projet via le serveur web proposé par symfony, tapez la commande suivante :
```
symfony serve
```
Le projet est alors accessible via l'adresse suivante : localhost:8000

- ##### Lancer le projet depuis XAMPP
Si vous avez choisi de lancer le projet via XAMPP, assurez vous que le serveur pointe vers le sous-dossier /public à l'intérieur du projet

### Accéder au compte adminstrateur
Si vous avez alimenté la base de donnée avec les fixtures, un compte administrateur a été créé avec les informations de connexions suivantes : 
```
login : admin@lequaiantique.fr
mdp : mySupErS3cr3tP4s5w0rd
```
Le mot de passe ainsi que l'adresse de connexion pourront ensuite être modifiés dans l'espace d'administration.

Dans le cas où vous n'auriez pas déployé les fixtures, le premier compte créé sur le site est celui de l'administrateur. Pour cela, il vous suffit alors de vous rendre sur la page "Mon Compte", puis de cliquer sur le lien vers la page de création de compte. Vous pourrez alors entrer toutes les informations nécessaires pour la création du compte administrateur.
