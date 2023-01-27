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
        $daysEnToFr = [
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche',
    ];

        $dayFromDate = date_format(new DateTime($date), 'l');  

        $dayFr = $daysEnToFr[$dayFromDate];

        $response = array();

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
