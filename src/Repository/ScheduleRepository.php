<?php

namespace App\Repository;

use App\Entity\Schedule;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Schedule>
 *
 * @method Schedule|null find($id, $lockMode = null, $lockVersion = null)
 * @method Schedule|null findOneBy(array $criteria, array $orderBy = null)
 * @method Schedule[]    findAll()
 * @method Schedule[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ScheduleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Schedule::class);
    }

    public function save(Schedule $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Schedule $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getScheduleByDate($date, $shift): array
    {
        // Array to translate day from english to french
        $daysEnToFr = [
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche',
    ];

        // getting the day corresponding to date chosen by the customer
        $dayFromDate = date_format(new DateTime($date), 'l');  

        // translating the day in french to query the databas
        $dayFr = $daysEnToFr[$dayFromDate];

        // preparing a container for the response
        $response = array();

        // depending if it's noon or evening shift, querying the infos needed
        if($shift === 'midi'){
            $qb = $this->createQueryBuilder('s')
            ->select('s.noonStart')
            ->addSelect('s.noonEnd')
            ->addSelect('s.noonClosed')
            ->andWhere('s.day = :val')
            ->setParameter('val', $dayFr)
            ->getQuery()
            ->getResult();

            $response['start'] = $qb[0]['noonStart'];
            $response['end'] = $qb[0]['noonEnd'];
            $response['closed'] = $qb[0]['noonClosed'];
        } else if($shift === 'soir'){
            $qb = $this->createQueryBuilder('s')
            ->select('s.eveningStart')
            ->addSelect('s.eveningEnd')
            ->addSelect('s.eveningClosed')
            ->andWhere('s.day = :val')
            ->setParameter('val', $dayFr)
            ->getQuery()
            ->getResult();

            $response['start'] = $qb[0]['eveningStart'];
            $response['end'] = $qb[0]['eveningEnd'];
            $response['closed'] = $qb[0]['eveningClosed'];
        }
        return $response;
    }

    // if schedule get emptied, or not containing 7 days, this method can initialised it
    public function populateSchedule(bool $flush)
    {
        $connection = $this->getEntityManager()->getConnection();
            $plateform = $connection->getDatabasePlatform();
            $connection->executeQuery($plateform->getTruncateTableSQL('schedule', true));

            //... Then filled with dummy values. Those values are the same of the AppFixtures
            $days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

            $schedule = array();

            for ($i = 0; $i < count($days); $i++) {
                $schedule[$i] = new Schedule();

                $schedule[$i]->setDay($days[$i]);
                $i <= 4 ? $schedule[$i]->setNoonClosed(false) : $schedule[$i]->setNoonClosed(true);
                $schedule[$i]->setNoonStart(new DateTime('11:00'));
                $schedule[$i]->setNoonEnd(new DateTime('14:00'));
                $i >= 4 && $i < 6 ? $schedule[$i]->setEveningClosed(false) : $schedule[$i]->setEveningClosed(true);
                $schedule[$i]->setEveningStart(new DateTime('17:00'));
                $schedule[$i]->setEveningEnd(new DateTime('21:00'));

                $this->getEntityManager()->persist($schedule[$i]);
                if($flush) {
                    $this->getEntityManager()->flush();
                }
            }
    }

    //    /**
    //     * @return Schedule[] Returns an array of Schedule objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Schedule
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
