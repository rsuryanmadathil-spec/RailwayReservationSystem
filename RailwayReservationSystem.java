
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Stack;
import java.util.Scanner;

class Passenger {
    int ticketId;
    String name;
    int age;
    String source;
    String destination;

    Passenger(int ticketId, String name, int age,
              String source, String destination) {
        this.ticketId = ticketId;
        this.name = name;
        this.age = age;
        this.source = source;
        this.destination = destination;
    }

    public void display() {
        System.out.println("Ticket ID: " + ticketId);
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Source: " + source);
        System.out.println("Destination: " + destination);
        System.out.println("----------------------------");
    }
}

public class RailwayReservationSystem {

    static ArrayList<Passenger> confirmedPassengers = new ArrayList<>();
    static Queue<Passenger> waitingList = new LinkedList<>();
    static Stack<Passenger> cancelledTickets = new Stack<>();

    static Scanner sc = new Scanner(System.in);
    static int ticketCounter = 1001;
    static final int MAX_CONFIRMED = 3;
    static final int MAX_WAITING = 5;

    static void bookTicket() {
        if (confirmedPassengers.size() >= MAX_CONFIRMED
                && waitingList.size() >= MAX_WAITING) {
            System.out.println("Train is full. Booking unavailable.");
            return;
        }

        System.out.print("Enter passenger name: ");
        String name = sc.nextLine();

        System.out.print("Enter passenger age: ");
        int age = sc.nextInt();
        sc.nextLine();

        if (age <= 0) {
            System.out.println("Invalid age.");
            return;
        }

        System.out.print("Enter source station: ");
        String source = sc.nextLine();

        System.out.print("Enter destination station: ");
        String destination = sc.nextLine();

        if (source.trim().isEmpty() || destination.trim().isEmpty()
                || source.equalsIgnoreCase(destination)) {
            System.out.println("Invalid source or destination.");
            return;
        }

        Passenger p = new Passenger(
                ticketCounter++, name, age, source, destination);

        if (confirmedPassengers.size() < MAX_CONFIRMED) {
            confirmedPassengers.add(p);
            System.out.println("Ticket confirmed successfully!");
        } else {
            waitingList.offer(p);
            System.out.println("Added to waiting list.");
        }

        System.out.println("Your Ticket ID: " + p.ticketId);
    }

    static void cancelTicket() {
        System.out.print("Enter ticket ID to cancel: ");
        int id = sc.nextInt();
        sc.nextLine();

        for (int i = 0; i < confirmedPassengers.size(); i++) {
            Passenger p = confirmedPassengers.get(i);

            if (p.ticketId == id) {
                confirmedPassengers.remove(i);
                cancelledTickets.push(p);

                System.out.println("Confirmed ticket cancelled.");

                if (!waitingList.isEmpty()) {
                    Passenger next = waitingList.poll();
                    confirmedPassengers.add(next);
                    System.out.println(
                            "Waiting passenger promoted to confirmed:");
                    next.display();
                }
                return;
            }
        }

        for (Passenger p : waitingList) {
            if (p.ticketId == id) {
                waitingList.remove(p);
                cancelledTickets.push(p);
                System.out.println("Waiting ticket cancelled.");
                return;
            }
        }

        System.out.println("Ticket ID not found.");
    }

    static void viewConfirmedPassengers() {
        if (confirmedPassengers.isEmpty()) {
            System.out.println("No confirmed passengers.");
            return;
        }

        System.out.println("\n--- CONFIRMED PASSENGERS ---");
        for (Passenger p : confirmedPassengers) {
            p.display();
        }
    }

    static void viewWaitingList() {
        if (waitingList.isEmpty()) {
            System.out.println("Waiting list is empty.");
            return;
        }

        System.out.println("\n--- WAITING LIST ---");
        for (Passenger p : waitingList) {
            p.display();
        }
    }

    static void searchTicket() {
        System.out.print("Enter ticket ID to search: ");
        int id = sc.nextInt();
        sc.nextLine();

        for (Passenger p : confirmedPassengers) {
            if (p.ticketId == id) {
                System.out.println("Status: CONFIRMED");
                p.display();
                return;
            }
        }

        for (Passenger p : waitingList) {
            if (p.ticketId == id) {
                System.out.println("Status: WAITING");
                p.display();
                return;
            }
        }

        System.out.println("Ticket not found in active bookings.");
    }

    static void viewCancelledTickets() {
        if (cancelledTickets.isEmpty()) {
            System.out.println("No cancelled tickets.");
            return;
        }

        System.out.println("\n--- RECENTLY CANCELLED TICKETS ---");

        for (int i = cancelledTickets.size() - 1; i >= 0; i--) {
            cancelledTickets.get(i).display();
        }
    }

    public static void main(String[] args) {
        int choice;

        do {
            System.out.println("\n================================");
            System.out.println(" RAILWAY TICKET RESERVATION");
            System.out.println("================================");
            System.out.println("1. Book Ticket");
            System.out.println("2. Cancel Ticket");
            System.out.println("3. View Confirmed Passengers");
            System.out.println("4. View Waiting List");
            System.out.println("5. Search Ticket");
            System.out.println("6. View Cancelled Tickets");
            System.out.println("7. Exit");
            System.out.print("Enter your choice: ");

            if (!sc.hasNextInt()) {
                System.out.println("Please enter a valid menu number.");
                sc.nextLine();
                continue;
            }

            choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {
                case 1:
                    bookTicket();
                    break;
                case 2:
                    cancelTicket();
                    break;
                case 3:
                    viewConfirmedPassengers();
                    break;
                case 4:
                    viewWaitingList();
                    break;
                case 5:
                    searchTicket();
                    break;
                case 6:
                    viewCancelledTickets();
                    break;
                case 7:
                    System.out.println("Thank you for using the system.");
                    break;
                default:
                    System.out.println("Invalid choice. Try again.");
            }

        } while (choice != 7);

        sc.close();
    }
}
