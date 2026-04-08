export type VehicleType = "sedan" | "suv" | "motorcycle";
export type Condition = "excellent" | "good" | "fair";

export interface Vehicle {
  id: string;
  title: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  condition: Condition;
  image: string;
  verified: boolean;
  featured: boolean;
}

export const vehicles: Vehicle[] = [
  {
    id: "1",
    title: "2021 Toyota Camry SE",
    type: "sedan",
    make: "Toyota",
    model: "Camry",
    year: 2021,
    price: 24500,
    mileage: 32000,
    location: "Los Angeles, CA",
    condition: "excellent",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
    verified: true,
    featured: true,
  },
  {
    id: "2",
    title: "2020 Honda CR-V EX",
    type: "suv",
    make: "Honda",
    model: "CR-V",
    year: 2020,
    price: 28900,
    mileage: 41000,
    location: "Houston, TX",
    condition: "excellent",
    image: "https://images.unsplash.com/photo-1568844293986-8d0400f085d1?w=600&h=400&fit=crop",
    verified: true,
    featured: true,
  },
  {
    id: "3",
    title: "2019 Harley-Davidson Sportster",
    type: "motorcycle",
    make: "Harley-Davidson",
    model: "Sportster",
    year: 2019,
    price: 9800,
    mileage: 12000,
    location: "Miami, FL",
    condition: "good",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop",
    verified: false,
    featured: true,
  },
  {
    id: "4",
    title: "2022 BMW X5 xDrive40i",
    type: "suv",
    make: "BMW",
    model: "X5",
    year: 2022,
    price: 52000,
    mileage: 18000,
    location: "Chicago, IL",
    condition: "excellent",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    verified: true,
    featured: true,
  },
  {
    id: "5",
    title: "2018 Ford Mustang GT",
    type: "sedan",
    make: "Ford",
    model: "Mustang",
    year: 2018,
    price: 31000,
    mileage: 45000,
    location: "Dallas, TX",
    condition: "good",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=600&h=400&fit=crop",
    verified: true,
    featured: false,
  },
  {
    id: "6",
    title: "2020 Kawasaki Ninja 650",
    type: "motorcycle",
    make: "Kawasaki",
    model: "Ninja 650",
    year: 2020,
    price: 7200,
    mileage: 8500,
    location: "Phoenix, AZ",
    condition: "excellent",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop",
    verified: false,
    featured: false,
  },
  {
    id: "7",
    title: "2021 Mercedes-Benz C300",
    type: "sedan",
    make: "Mercedes-Benz",
    model: "C300",
    year: 2021,
    price: 39500,
    mileage: 22000,
    location: "Atlanta, GA",
    condition: "excellent",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    verified: true,
    featured: true,
  },
  {
    id: "8",
    title: "2019 Jeep Wrangler Unlimited",
    type: "suv",
    make: "Jeep",
    model: "Wrangler",
    year: 2019,
    price: 35800,
    mileage: 38000,
    location: "Denver, CO",
    condition: "good",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop",
    verified: true,
    featured: false,
  },
  {
    id: "9",
    title: "2017 Honda Civic Si",
    type: "sedan",
    make: "Honda",
    model: "Civic",
    year: 2017,
    price: 19500,
    mileage: 58000,
    location: "Portland, OR",
    condition: "fair",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=400&fit=crop",
    verified: false,
    featured: false,
  },
  {
    id: "10",
    title: "2023 Tesla Model Y",
    type: "suv",
    make: "Tesla",
    model: "Model Y",
    year: 2023,
    price: 44000,
    mileage: 8000,
    location: "San Francisco, CA",
    condition: "excellent",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop",
    verified: true,
    featured: true,
  },
];

export const makes = [...new Set(vehicles.map((v) => v.make))];
export const vehicleTypes: VehicleType[] = ["sedan", "suv", "motorcycle"];
export const conditions: Condition[] = ["excellent", "good", "fair"];
