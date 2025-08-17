import { PrismaClient, Role, Mode, Specialization } from './src/prisma/generated/prisma';
import { addDays, startOfDay, setHours, setMinutes, addMinutes } from 'date-fns';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// Number of doctors per specialization
const DOCTORS_PER_SPECIALIZATION = 2;
// Number of availability slots per doctor
const SLOTS_PER_DOCTOR = 5;

async function main() {
    console.log('🌱 Seeding database...');
    
    // Clear existing data
    await prisma.appointment.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.user.deleteMany();

    // 1️⃣ Create regular users (patients)
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Fix 1: Explicitly type the patients array
    const patients: Awaited<ReturnType<typeof prisma.user.create>>[] = [];
    
    for (let i = 0; i < 10; i++) {
        const patient = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: passwordHash,
                role: Role.USER,
            },
        });
        patients.push(patient);
    }

    // 2️⃣ Create doctors for each specialization
    const specializations = Object.values(Specialization);
    
    // Fix 2: Explicitly type the doctors array
    const doctors: Awaited<ReturnType<typeof prisma.doctor.create>>[] = [];
    
    for (const specialization of specializations) {
        for (let i = 0; i < DOCTORS_PER_SPECIALIZATION; i++) {
            const doctorUser = await prisma.user.create({
                data: {
                    name: `Dr. ${faker.person.fullName()}`,
                    email: faker.internet.email({ firstName: 'doctor' }),
                    password: passwordHash,
                    role: Role.DOCTOR,
                },
            });

            const modes = Object.values(Mode);
            const randomMode = faker.helpers.arrayElement(modes);
            
            const doctor = await prisma.doctor.create({
                data: {
                    userId: doctorUser.id,
                    specialization: specialization,
                    mode: randomMode,
                    bio: faker.lorem.paragraph(),
                    experience: faker.number.int({ min: 1, max: 20 }),
                    consultationFee: new Decimal(faker.number.float({
                        min: 300,
                        max: 1500,
                    })),
                },
            });
            doctors.push(doctor);
        }
    }

    // 3️⃣ Create availability slots for each doctor
    const today = startOfDay(new Date());
    const twoDaysLater = addDays(today, 2);
    
    for (const doctor of doctors) {
        // Fix 3: Use proper Prisma input type for availabilities
        const availabilities: {
            doctorId: string;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        }[] = [];
        
        for (let i = 0; i < SLOTS_PER_DOCTOR; i++) {
            // Spread slots over the next 7 days
            const dayOffset = faker.number.int({ min: 0, max: 6 });
            const date = addDays(twoDaysLater, dayOffset);
            
            // Random hour between 9 AM and 5 PM
            const hour = faker.number.int({ min: 9, max: 16 });
            const minute = faker.helpers.arrayElement([0, 30]);
            
            const startTime = setMinutes(setHours(date, hour), minute);
            const endTime = addMinutes(startTime, 30);
            
            availabilities.push({
                doctorId: doctor.id,
                startTime,
                endTime,
                isBooked: false,
            });
        }
        
        await prisma.availability.createMany({
            data: availabilities,
        });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`Created: 
    - ${patients.length} patients
    - ${doctors.length} doctors
    - ${doctors.length * SLOTS_PER_DOCTOR} availability slots`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });