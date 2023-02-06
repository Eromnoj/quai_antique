<?php

namespace App\Controller;

use App\Repository\RestaurantRepository;
use App\Repository\ScheduleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{
    #[Route('/login', name: 'app_login')]
    public function index(AuthenticationUtils $authenticationUtils,ScheduleRepository $scheduleRepository, RestaurantRepository $restaurantRepository): Response
    {

        // get the error login if there is ob_end_clean
        $error = $authenticationUtils->getLastAuthenticationError();

        //last username entered by the user_error
        $lastUsername = $authenticationUtils->getLastUsername();

        $info = $restaurantRepository->findAll();
        $schedule = $scheduleRepository->findAll();
        return $this->render('login/index.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
            'schedule' => $schedule,
            'info' => $info[0]
        ]);
    }

    #[Route('/login_success', name: 'login_success')]
    public function loginRedirect(Security $security)
    {
        $user = $security->getUser();

        if ($user) {

            if (in_array("ROLE_ADMIN", $user->getRoles())) {
                return $this->redirectToRoute('app_admin_restaurant');
            } else if (in_array("ROLE_USER", $user->getRoles())) {
                return $this->redirectToRoute('app_user_profil');
            }
        } else {
            return $this->redirectToRoute('app_login');
        }
    }

    #[Route('/logout', name: 'app_logout', methods: ['GET'])]
    public function logout()
    {
        // controller can be blank: it will never be called!
    }
}
