<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/user')]
class UserController extends AbstractController
{
    #[Route('/profil', name: 'app_user_profil')]
    public function profil(): Response
    {
        return $this->render('user/profil.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    #[Route('/account', name: 'app_user_account')]
    public function account(): Response
    {
        return $this->render('user/account.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }
}
