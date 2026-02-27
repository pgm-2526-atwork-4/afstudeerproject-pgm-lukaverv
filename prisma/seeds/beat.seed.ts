import { prisma } from "../../server/utils/db";
import bcrypt from "bcrypt";

export async function seedBeats() {
  // Create test producer profiles
  const hashedPassword = await bcrypt.hash("password123", 10);

  const producer1 = await prisma.user.upsert({
    where: { email: "producer1@beatstack.com" },
    update: {},
    create: {
      email: "producer1@beatstack.com",
      password: hashedPassword,
      isVerified: true,
      profile: {
        create: {
          firstName: "Mike",
          lastName: "Beats",
          username: "mikebeats",
          role: "PRODUCER",
          bio: "Lo-Fi & Chill beat producer",
        },
      },
    },
    include: { profile: true },
  });

  const producer2 = await prisma.user.upsert({
    where: { email: "producer2@beatstack.com" },
    update: {},
    create: {
      email: "producer2@beatstack.com",
      password: hashedPassword,
      isVerified: true,
      profile: {
        create: {
          firstName: "Sarah",
          lastName: "Trap",
          username: "sarahtrap",
          role: "PRODUCER",
          bio: "Trap & Drill specialist",
        },
      },
    },
    include: { profile: true },
  });

  // Create beats
  const beats = [
    {
      title: "Midnight Thoughts",
      producerId: producer1.profile!.id,
      genre: "Lo-Fi",
      bpm: 85,
      key: "C",
      duration: 156,
      tags: ["Chill", "Melodic", "Smooth"],
      priceBasic: 29.99,
      pricePremium: 49.99,
      priceExclusive: 199.99,
      coverImage: "https://picsum.photos/seed/beat1/400/400",
      audioFile: "https://example.com/beats/midnight-thoughts.mp3",
      description: "A smooth lo-fi beat perfect for late night vibes",
      isPublished: true,
    },
    {
      title: "Trap Heat",
      producerId: producer2.profile!.id,
      genre: "Trap",
      bpm: 140,
      key: "D#m",
      duration: 180,
      tags: ["Hard", "808", "Dark"],
      priceBasic: 34.99,
      pricePremium: 59.99,
      priceExclusive: 249.99,
      coverImage: "https://picsum.photos/seed/beat2/400/400",
      audioFile: "https://example.com/beats/trap-heat.mp3",
      description: "Heavy hitting trap beat with punchy 808s",
      isPublished: true,
    },
    {
      title: "Summer Vibes",
      producerId: producer1.profile!.id,
      genre: "Pop",
      bpm: 120,
      key: "G",
      duration: 195,
      tags: ["Happy", "Upbeat", "Melodic"],
      priceBasic: 24.99,
      pricePremium: 44.99,
      priceExclusive: 179.99,
      coverImage: "https://picsum.photos/seed/beat3/400/400",
      audioFile: "https://example.com/beats/summer-vibes.mp3",
      description: "Uplifting pop beat with summer vibes",
      isPublished: true,
    },
    {
      title: "Dark Energy",
      producerId: producer2.profile!.id,
      genre: "Drill",
      bpm: 138,
      key: "Am",
      duration: 165,
      tags: ["Dark", "Aggressive", "808"],
      priceBasic: 39.99,
      pricePremium: 64.99,
      priceExclusive: 299.99,
      coverImage: "https://picsum.photos/seed/beat4/400/400",
      audioFile: "https://example.com/beats/dark-energy.mp3",
      description: "Aggressive drill beat with dark atmosphere",
      isPublished: true,
    },
    {
      title: "R&B Smooth",
      producerId: producer1.profile!.id,
      genre: "R&B",
      bpm: 95,
      key: "F",
      duration: 210,
      tags: ["Smooth", "Melodic"],
      priceBasic: 32.99,
      pricePremium: 54.99,
      priceExclusive: 229.99,
      coverImage: "https://picsum.photos/seed/beat5/400/400",
      audioFile: "https://example.com/beats/rnb-smooth.mp3",
      description: "Smooth R&B beat with soulful melodies",
      isPublished: true,
    },
    {
      title: "Boom Bap Classic",
      producerId: producer2.profile!.id,
      genre: "Boom Bap",
      bpm: 90,
      key: "Em",
      duration: 175,
      tags: ["Classic", "Hip-Hop"],
      priceBasic: 27.99,
      pricePremium: 47.99,
      priceExclusive: 189.99,
      coverImage: "https://picsum.photos/seed/beat6/400/400",
      audioFile: "https://example.com/beats/boom-bap-classic.mp3",
      description: "Old school boom bap with classic vibes",
      isPublished: true,
    },
  ];

  for (const beatData of beats) {
    await prisma.beat.upsert({
      where: {
        id: `beat-${beatData.title.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: beatData,
      create: {
        id: `beat-${beatData.title.toLowerCase().replace(/\s+/g, "-")}`,
        ...beatData,
      },
    });
  }
}
