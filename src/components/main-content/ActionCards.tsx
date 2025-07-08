
// Removed from project for now. May use again later

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, PenTool, Calendar, MessageCircle } from "lucide-react"

const ActionCards = () => {
  const actionCards = [
    {
      title: "Draft email",
      description: "Generate email for any occasion you need.",
      icon: Mail,
      iconColor: "text-blue-500"
    },
    {
      title: "Write an Essay",
      description: "Generate essay for any occasion you need.",
      icon: PenTool,
      iconColor: "text-green-500"
    },
    {
      title: "Planning",
      description: "Plan for any occasion, from holiday to family.",
      icon: Calendar,
      iconColor: "text-purple-500"
    },
    {
      title: "Assistant",
      description: "Become your personal assistant. Helping you.",
      icon: MessageCircle,
      iconColor: "text-orange-500"
    }
  ];

  return (
    <section className="mt-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actionCards.map((card, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow h-32">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                <CardTitle className="text-base">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                {card.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ActionCards;
