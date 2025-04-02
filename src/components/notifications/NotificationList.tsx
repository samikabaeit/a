import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import NotificationItem from "./NotificationItem";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
    id: string;
    // Add other notification properties as needed
}

interface NotificationListProps {
    notifications: Notification[];
    isLoading: boolean;
    onMarkAsRead: (id: string) => void;
    activeTab?: "unread" | "read";
    onTabChange: (value: "unread" | "read") => void;
    unreadCount?: number;
    hasMore: boolean;
    loaderRef: React.RefObject<HTMLDivElement>;
}

const NotificationList: React.FC<NotificationListProps> = ({
                                                               notifications,
                                                               isLoading,
                                                               onMarkAsRead,
                                                               activeTab = "unread",
                                                               onTabChange,
                                                               unreadCount = 0,
                                                               hasMore,
                                                               loaderRef
                                                           }) => {
    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sticky top-0 bg-white z-10">
                <TabsTrigger value="unread" className="relative">
                    Unread
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
                    )}
                </TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="mt-0">
                <AnimatePresence>
                    {notifications.map((notification, index) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <NotificationItem
                                notification={notification}
                                onMarkAsRead={onMarkAsRead}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </TabsContent>

            <TabsContent value="read" className="mt-0">
                <AnimatePresence>
                    {notifications.map((notification, index) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <NotificationItem
                                notification={notification}
                                onMarkAsRead={onMarkAsRead}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </TabsContent>

            {/* Infinite scroll loader */}
            {hasMore && (
                <div ref={loaderRef} className="py-4">
                    <SkeletonNotification />
                </div>
            )}

            {isLoading && !hasMore && (
                <div className="py-4">
                    <SkeletonNotification />
                </div>
            )}

            {!hasMore && !isLoading && notifications.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    You've reached the end
                </div>
            )}

            {!isLoading && notifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No {activeTab} notifications
                </div>
            )}
        </Tabs>
    );
};

const SkeletonNotification: React.FC = () => {
    return (
        <div className="p-4 border rounded-lg mb-3">
            <div className="flex gap-3">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full max-w-[15rem]" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full max-w-[80%]" />
                    <div className="pt-2">
                        <Skeleton className="h-32 w-full max-w-xs rounded-lg" />
                    </div>
                    <div className="flex gap-2 pt-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationList;