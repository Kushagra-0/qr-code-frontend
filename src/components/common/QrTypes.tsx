import youtube from "../../assets/social-icons/youtube.png";
import instagram from "../../assets/social-icons/instagram.png";
import facebook from "../../assets/social-icons/facebook.png";
import telegram from "../../assets/social-icons/telegram.png";
import linkedin from "../../assets/social-icons/linkedin2.png";
import whatsapp from "../../assets/social-icons/whatsapp.png";
import { AlignLeft, AtSign, DollarSign, FileText, Image, Link, MapPin, MessageSquare, Music, Phone } from "react-feather";

export const qrTypes = [
    { label: "URL/Link", value: "URL", size: "col-span-7", supportIcon: <Link /> },
    { label: "Image", value: "IMAGE", size: "col-span-4", supportIcon: <Image /> },
    { label: "Email", value: "EMAIL", size: "col-span-3", supportIcon: <AtSign /> },
    { label: "Pdf", value: "PDF", size: "col-span-4", supportIcon: <FileText /> },
    { label: "Text", value: "TEXT", size: "col-span-3", supportIcon: <AlignLeft /> },
    { label: "SMS", value: "SMS", size: "col-span-2", supportIcon: <MessageSquare /> },
    { label: "Phone Call", value: "PHONE", size: "col-span-2", supportIcon: <Phone /> },
    { label: "Audio", value: "AUDIO", size: "col-span-2", supportIcon: <Music /> },
    { label: "YouTube", value: "YOUTUBE", size: "col-span-1", mainIcon: youtube },
    { label: "Instagram", value: "INSTAGRAM", size: "col-span-1", mainIcon: instagram },
    { label: "Facebook", value: "FACEBOOK", size: "col-span-1", mainIcon: facebook },
    { label: "Telegram", value: "TELEGRAM", size: "col-span-1", mainIcon: telegram },
    { label: "LinkedIn", value: "LINKEDIN", size: "col-span-1", mainIcon: linkedin },
    { label: "X / Twitter", value: "TWITTER", size: "col-span-2" },
    { label: "WhatsApp", value: "WHATSAPP", size: "col-span-1", mainIcon: whatsapp },
    { label: "Location", value: "LOCATION", size: "col-span-2", supportIcon: <MapPin />},
    { label: "UPI Payment", value: "UPI", size: "col-span-2", supportIcon: <DollarSign />},
];