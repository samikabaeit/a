import React from "react";
import { Bell, Info, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, Image } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const iconMap = {
    info: <Info className="w-5 h-5 text-blue-500" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />
};

export default function NotificationItem({ notification, onMarkAsRead }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border mb-3 ${
                notification.is_read ? "bg-gray-50" : "bg-white shadow-sm"
            }`}
            onClick={() => !notification.is_read && onMarkAsRead(notification)}
        >
            <div className="flex items-start gap-3">
                <div className="shrink-0">
                    {iconMap[notification.type] || <Bell className="w-5 h-5 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-medium ${notification.is_read ? "text-gray-600" : "text-gray-900"}`}>
                        {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                    {notification.link && (
                        <img
                            src={notification.link}
                            alt={notification.title}
                            className="mt-3 rounded-lg w-full max-w-xs h-40 object-cover"
                        />
                    )}
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                        <span>{format(new Date(notification.created_date), "MMM d, h:mm a")}</span>
                        {notification.link && (
                            <a
                                href={notification.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image className="w-4 h-4" />
                                View full image
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}