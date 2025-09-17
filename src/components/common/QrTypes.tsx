import youtube from "../../assets/social-icons/youtube.png";
import instagram from "../../assets/social-icons/instagram.png";
import facebook from "../../assets/social-icons/facebook.png";
import telegram from "../../assets/social-icons/telegram.png";
import linkedin from "../../assets/social-icons/linkedin2.png";
import whatsapp from "../../assets/social-icons/whatsapp.png";
import spotify from "../../assets/social-icons/spotify.png";
import { AlignLeft, AtSign, Calendar, Clipboard, CreditCard, DollarSign, File, FileText, Image, Layout, Link, MapPin, MessageSquare, Music, Phone, Rss, Tv, User, Video, Wifi } from "react-feather";

export const qrTypes = [
    { label: "URL/Link", value: "URL", size: "col-span-7", supportIcon: <Link />, iconType: 1 },
    { label: "Image", value: "IMAGE", size: "col-span-4", supportIcon: <Image />, iconType: 1 },
    { label: "Email", value: "EMAIL", size: "col-span-3", supportIcon: <AtSign />, iconType: 1 },
    { label: "Pdf", value: "PDF", size: "col-span-4", supportIcon: <FileText />, iconType: 1 },
    { label: "Text", value: "TEXT", size: "col-span-3", supportIcon: <AlignLeft />, iconType: 1 },
    { label: "SMS", value: "SMS", size: "col-span-2", supportIcon: <MessageSquare />, iconType: 1 },
    { label: "Phone Call", value: "PHONE", size: "col-span-2", supportIcon: <Phone />, iconType: 1 },
    { label: "Audio", value: "AUDIO", size: "col-span-3", supportIcon: <Music />, iconType: 1 },
    { label: "YouTube", value: "YOUTUBE", size: "col-span-1", mainIcon: youtube, iconType: 2 },
    { label: "Facebook", value: "FACEBOOK", size: "col-span-1", mainIcon: facebook, iconType: 2 },
    { label: "WhatsApp", value: "WHATSAPP", size: "col-span-2 row-span-2", mainIcon: whatsapp, iconType: 3 },
    { label: "Location", value: "LOCATION", size: "col-span-3", supportIcon: <MapPin />, iconType: 1},
    { label: "PPTX", value: "PPTX", size: "col-span-2", supportIcon: <Tv />, iconType: 1},
    { label: "Excel", value: "EXCEL", size: "col-span-2", supportIcon: <Layout />, iconType: 1},
    { label: "Video", value: "VIDEO", size: "col-span-3", supportIcon: <Video />, iconType: 1},
    { label: "Instagram", value: "INSTAGRAM", size: "col-span-1", mainIcon: instagram, iconType: 2 }, 
    { label: "Telegram", value: "TELEGRAM", size: "col-span-1", mainIcon: telegram, iconType: 2 },
    { label: "Google Form", value: "GOOGLEFORM", size: "col-span-3", supportIcon: <Clipboard />, iconType: 1},
    { label: "Wifi", value: "WIFI", size: "col-span-2", supportIcon: <Wifi />, iconType: 1},
    { label: "Office 365", value: "OFFICE365", size: "col-span-2", supportIcon: <File />, iconType: 1},
    { label: "Calender", value: "CALENDER", size: "col-span-3", supportIcon: <Calendar />, iconType: 1},
    { label: "LinkedIn", value: "LINKEDIN", size: "col-span-1", mainIcon: linkedin, iconType: 2 },
    { label: "Spotify", value: "SPOTIFY", size: "col-span-1", mainIcon: spotify, iconType: 2 },
    { label: "Social Media", value: "SOCIALMEDIA", size: "col-span-3", supportIcon: <User />, iconType: 1},
    { label: "X / Twitter", value: "TWITTER", size: "col-span-2", iconType: 1 },
    { label: "Payment", value: "PAYMENT", size: "col-span-2", supportIcon: <CreditCard />, iconType: 1},
    { label: "UPI Payment", value: "UPI", size: "col-span-5", supportIcon: <DollarSign />, iconType: 1},
];