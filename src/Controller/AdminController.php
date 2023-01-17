<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/admin')]
class AdminController extends AbstractController
{
    #[Route('/restaurant', name: 'app_admin_restaurant')]
    public function index(): Response
    {
        return $this->render('admin/restaurant.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }

    #[Route('/lacarte', name: 'app_admin_dishes')]
    public function dishes(): Response
    {
        return $this->render('admin/dishes.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }

    #[Route('/lesmenus', name: 'app_admin_menus')]
    public function menus(): Response
    {
        return $this->render('admin/menus.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }

    #[Route('/reservations', name: 'app_admin_booking')]
    public function adminBooking(): Response
    {
        return $this->render('admin/booking.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }
}
