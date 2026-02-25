import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import organicImg from "@assets/generated_images/organic_waste_illustration.png";
import recyclableImg from "@assets/generated_images/recyclable_waste_illustration.png";
import hazardousImg from "@assets/generated_images/hazardous_waste_illustration.png";

export default function Education() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">Waste Management Guide</h1>
        <p className="text-lg text-muted-foreground">
          Proper segregation is the first step towards a cleaner city. Learn how to dispose of different types of waste responsibly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <EducationCard 
          title="Organic Waste" 
          image={organicImg}
          color="bg-green-50 border-green-200"
          textColor="text-green-800"
          items={[
            "Fruit and vegetable peels",
            "Leftover food",
            "Coffee grounds & tea bags",
            "Garden trimmings & leaves"
          ]}
          notItems={[
            "Plastic wrappers",
            "Metals or glass",
            "Pet waste (in some cases)"
          ]}
        />
        
        <EducationCard 
          title="Recyclable Waste" 
          image={recyclableImg}
          color="bg-blue-50 border-blue-200"
          textColor="text-blue-800"
          items={[
            "Paper & Cardboard",
            "Plastic bottles (PET)",
            "Glass jars & bottles",
            "Metal cans & tins"
          ]}
          notItems={[
            "Greasy pizza boxes",
            "Broken glass",
            "Plastic bags (soft plastic)"
          ]}
        />

        <EducationCard 
          title="Hazardous Waste" 
          image={hazardousImg}
          color="bg-red-50 border-red-200"
          textColor="text-red-800"
          items={[
            "Batteries",
            "Light bulbs & tubes",
            "Paint & chemicals",
            "Electronic waste (e-waste)"
          ]}
          notItems={[
            "Regular household trash",
            "Empty shampoo bottles (recycle)"
          ]}
        />
      </div>

      <div className="mt-16 bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Segregate?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
          <div>
            <h3 className="font-semibold text-lg mb-2">Reduces Landfill Waste</h3>
            <p className="text-muted-foreground">By recycling and composting, we significantly reduce the amount of waste sent to overflowing landfills.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Conserves Resources</h3>
            <p className="text-muted-foreground">Recycling materials like aluminum and paper saves huge amounts of energy compared to producing them from raw materials.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Protects Environment</h3>
            <p className="text-muted-foreground">Proper disposal of hazardous waste prevents toxic chemicals from leaching into our soil and water systems.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationCard({ title, image, color, textColor, items, notItems }: any) {
  return (
    <Card className={`overflow-hidden border-2 ${color} transition-transform hover:-translate-y-1 duration-300`}>
      <div className="aspect-square p-8 bg-white/50 flex items-center justify-center">
        <img src={image} alt={title} className="w-full h-full object-contain" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className={`text-2xl ${textColor}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Do's
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground ml-4 list-disc">
            {items.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Don'ts
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground ml-4 list-disc">
            {notItems.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
