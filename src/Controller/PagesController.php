<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PagesController extends AbstractController
{
    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        return $this->render('pages/index.html.twig', [
            'controller_name' => 'PagesController',
        ]);
    }

    #[Route('/carte', name: 'app_dishes')]
    public function dishes(): Response
    {
        return $this->render('pages/dishes.html.twig', [
            'controller_name' => 'PagesController',
        ]);
    }

    #[Route('/menus', name: 'app_menus')]
    public function menus(): Response
    {
        return $this->render('pages/menus.html.twig', [
            'controller_name' => 'PagesController',
        ]);
    }

    #[Route('/reservation', name: 'app_booking')]
    public function booking(): Response
    {
        return $this->render('pages/booking.html.twig', [
            'controller_name' => 'PagesController',
        ]);
    }
}