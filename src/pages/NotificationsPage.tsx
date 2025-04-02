import React, { useState, useEffect, useRef, useCallback } from "react";
import NotificationList from "@/components/notifications/NotificationList";

const PAGE_SIZE = 10;

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success';
    is_read: boolean;
    created_date: string;
    link?: string;
}

interface NotificationsState {
    unread: Notification[];
    read: Notification[];
}

// Assuming these are defined somewhere or imported
const MOCK_BIRDS = [
    { id: 1, name: "American Robin", description: "A migratory songbird with a reddish-orange breast and gray-brown upperparts.", image: "https://images.unsplash.com/photo-1555328039-421e6e951751?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 2, name: "Bald Eagle", description: "A bird of prey with a white head and tail, found in North America.", image: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 3, name: "Northern Cardinal", description: "A medium-sized songbird with a distinctive crest and bright red plumage (males).", image: "https://images.unsplash.com/photo-1549608276-5786777e6587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 4, name: "Blue Jay", description: "A colorful, noisy bird with bright blue plumage and a bold personality.", image: "https://images.unsplash.com/photo-1591198936750-16d8e15edb9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 5, name: "Great Blue Heron", description: "A large wading bird with long legs, found near water bodies.", image: "https://images.unsplash.com/photo-1575350126138-9259296a9a7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 6, name: "Ruby-throated Hummingbird", description: "A tiny bird known for its hovering flight and iridescent feathers.", image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 7, name: "Barn Owl", description: "A nocturnal bird of prey with a distinctive heart-shaped face.", image: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 8, name: "Mallard Duck", description: "A common wild duck with a distinctive green head (males).", image: "https://images.unsplash.com/photo-1565889673146-8e4ae13fb1d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 9, name: "Atlantic Puffin", description: "A seabird with a colorful beak, often called the 'sea parrot'.", image: "https://images.unsplash.com/photo-1553736026-ff14d994c36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 10, name: "Peregrine Falcon", description: "The fastest bird in the world, capable of diving at speeds over 200 mph.", image: "https://images.unsplash.com/photo-1561989571-b2a48b7d2d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 11, name: "California Condor", description: "One of the largest flying birds in North America, with a wingspan of up to 10 feet.", image: "https://images.unsplash.com/photo-1612024782955-49fae79e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 12, name: "Snowy Owl", description: "A large white owl native to the Arctic regions, with some black or brown markings.", image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 13, name: "Scarlet Macaw", description: "A large, colorful parrot with red, yellow, and blue feathers.", image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 14, name: "Emperor Penguin", description: "The tallest and heaviest of all living penguin species.", image: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 15, name: "Flamingo", description: "A wading bird known for its bright pink feathers and distinctive curved bill.", image: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 16, name: "American Robin", description: "A migratory songbird with a reddish-orange breast and gray-brown upperparts.", image: "https://images.unsplash.com/photo-1555328039-421e6e951751?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 17, name: "Bald Eagle", description: "A bird of prey with a white head and tail, found in North America.", image: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 18, name: "Northern Cardinal", description: "A medium-sized songbird with a distinctive crest and bright red plumage (males).", image: "https://images.unsplash.com/photo-1549608276-5786777e6587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 19, name: "Blue Jay", description: "A colorful, noisy bird with bright blue plumage and a bold personality.", image: "https://images.unsplash.com/photo-1591198936750-16d8e15edb9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 20, name: "Great Blue Heron", description: "A large wading bird with long legs, found near water bodies.", image: "https://images.unsplash.com/photo-1575350126138-9259296a9a7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 21, name: "Ruby-throated Hummingbird", description: "A tiny bird known for its hovering flight and iridescent feathers.", image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 22, name: "Barn Owl", description: "A nocturnal bird of prey with a distinctive heart-shaped face.", image: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 23, name: "Mallard Duck", description: "A common wild duck with a distinctive green head (males).", image: "https://images.unsplash.com/photo-1565889673146-8e4ae13fb1d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 24, name: "Atlantic Puffin", description: "A seabird with a colorful beak, often called the 'sea parrot'.", image: "https://images.unsplash.com/photo-1553736026-ff14d994c36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 25, name: "Peregrine Falcon", description: "The fastest bird in the world, capable of diving at speeds over 200 mph.", image: "https://images.unsplash.com/photo-1561989571-b2a48b7d2d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 26, name: "California Condor", description: "One of the largest flying birds in North America, with a wingspan of up to 10 feet.", image: "https://images.unsplash.com/photo-1612024782955-49fae79e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 27, name: "Snowy Owl", description: "A large white owl native to the Arctic regions, with some black or brown markings.", image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 28, name: "Scarlet Macaw", description: "A large, colorful parrot with red, yellow, and blue feathers.", image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 29, name: "Emperor Penguin", description: "The tallest and heaviest of all living penguin species.", image: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: 30, name: "Flamingo", description: "A wading bird known for its bright pink feathers and distinctive curved bill.", image: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
];

const MOCK_JOKES = [
    { id: 101, setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" },
    { id: 102, setup: "Why was the JavaScript developer sad?", punchline: "Because he didn't know how to 'null' his feelings." },
    { id: 103, setup: "How many programmers does it take to change a light bulb?", punchline: "None, that's a hardware problem." },
    { id: 104, setup: "Why do Java developers wear glasses?", punchline: "Because they don't C#." },
    { id: 105, setup: "What's a programmer's favorite hangout place?", punchline: "The Foo Bar." },
    { id: 106, setup: "Why did the programmer quit his job?", punchline: "Because he didn't get arrays." },
    { id: 107, setup: "Why do programmers always mix up Halloween and Christmas?", punchline: "Because Oct 31 == Dec 25." },
    { id: 108, setup: "Why was the function sad after a successful first call?", punchline: "It didn't get a callback." },
    { id: 109, setup: "Why do programmers hate nature?", punchline: "It has too many bugs and no debugging tool." },
    { id: 110, setup: "What's a database administrator's favorite song?", punchline: "Another one bites the dust." },
    { id: 111, setup: "Why don't programmers like to go outside?", punchline: "The sun causes too many reflections." },
    { id: 112, setup: "What did the router say to the doctor?", punchline: "It hurts when IP." },
    { id: 113, setup: "How many software engineers does it take to change a light bulb?", punchline: "None, it's a hardware problem." },
    { id: 201, setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" },
    { id: 202, setup: "Why was the JavaScript developer sad?", punchline: "Because he didn't know how to 'null' his feelings." },
    { id: 203, setup: "How many programmers does it take to change a light bulb?", punchline: "None, that's a hardware problem." },
    { id: 204, setup: "Why do Java developers wear glasses?", punchline: "Because they don't C#." },
    { id: 205, setup: "What's a programmer's favorite hangout place?", punchline: "The Foo Bar." },
    { id: 206, setup: "Why did the programmer quit his job?", punchline: "Because he didn't get arrays." },
    { id: 207, setup: "Why do programmers always mix up Halloween and Christmas?", punchline: "Because Oct 31 == Dec 25." },
    { id: 208, setup: "Why was the function sad after a successful first call?", punchline: "It didn't get a callback." },
    { id: 209, setup: "Why do programmers hate nature?", punchline: "It has too many bugs and no debugging tool." },
    { id: 210, setup: "What's a database administrator's favorite song?", punchline: "Another one bites the dust." },
    { id: 211, setup: "Why don't programmers like to go outside?", punchline: "The sun causes too many reflections." },
    { id: 212, setup: "What did the router say to the doctor?", punchline: "It hurts when IP." },
    { id: 213, setup: "How many software engineers does it take to change a light bulb?", punchline: "None, it's a hardware problem." }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationsState>({ unread: [], read: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'unread' | 'read'>("unread");
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const loader = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
            setPage(prev => prev + 1);
        }
    }, [hasMore, isLoading]);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);

        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [handleObserver]);

    useEffect(() => {
        setPage(1);
        setNotifications(prev => ({
            ...prev,
            [activeTab]: []
        }));
        setHasMore(true);
    }, [activeTab]);

    useEffect(() => {
        loadNotifications();
    }, [page, activeTab]);

    const loadNotifications = async () => {
        if (!hasMore) return;

        setIsLoading(true);
        try {
            let newData: Notification[] = [];
            const startIdx = (page - 1) * PAGE_SIZE;
            const endIdx = startIdx + PAGE_SIZE;

            if (activeTab === "unread") {
                try {
                    const response = await fetch('https://freetestapi.com/api/v1/birds', { mode: 'cors' });
                    const birdsData = await response.json();
                    newData = birdsData.slice(startIdx, endIdx).map((bird: any) => ({
                        id: `bird-${bird.id}`,
                        title: bird.name,
                        message: bird.description || 'No description available',
                        type: 'info' as const,
                        is_read: false,
                        created_date: new Date().toISOString(),
                        link: bird.image
                    }));

                    if (newData.length === 0) {
                        newData = MOCK_BIRDS.slice(startIdx, endIdx).map((bird: any) => ({
                            id: `bird-${bird.id}`,
                            title: bird.name,
                            message: bird.description || 'No description available',
                            type: 'info' as const,
                            is_read: false,
                            created_date: new Date().toISOString(),
                            link: bird.image
                        }));
                    }
                } catch (error) {
                    console.warn("Birds API failed, using mock data:", error);
                    newData = MOCK_BIRDS.slice(startIdx, endIdx).map((bird: any) => ({
                        id: `bird-${bird.id}`,
                        title: bird.name,
                        message: bird.description || 'No description available',
                        type: 'info' as const,
                        is_read: false,
                        created_date: new Date().toISOString(),
                        link: bird.image
                    }));
                }
            } else {
                try {
                    const response = await fetch('https://official-joke-api.appspot.com/jokes/programming/random', { mode: 'cors' });
                    let jokesData = await response.json();
                    if (!Array.isArray(jokesData)) jokesData = [jokesData];

                    newData = jokesData.map((joke: any) => ({
                        id: `joke-${joke.id}`,
                        title: joke.setup || "Why did the developer quit his job?",
                        message: joke.punchline || "Because he didn't get arrays!",
                        type: 'success' as const,
                        is_read: true,
                        created_date: new Date().toISOString()
                    }));

                    if (newData.length < PAGE_SIZE) {
                        const mockJokes = MOCK_JOKES.slice(startIdx, endIdx).map((joke: any) => ({
                            id: `joke-${joke.id}`,
                            title: joke.setup,
                            message: joke.punchline,
                            type: 'success' as const,
                            is_read: true,
                            created_date: new Date().toISOString()
                        }));
                        newData = [...newData, ...mockJokes].slice(0, PAGE_SIZE);
                    }
                } catch (error) {
                    console.warn("Jokes API failed, using mock data:", error);
                    newData = MOCK_JOKES.slice(startIdx, endIdx).map((joke: any) => ({
                        id: `joke-${joke.id}`,
                        title: joke.setup,
                        message: joke.punchline,
                        type: 'success' as const,
                        is_read: true,
                        created_date: new Date().toISOString()
                    }));
                }
            }

            if (newData.length < PAGE_SIZE) {
                setHasMore(false);
            }

            setNotifications(prev => ({
                ...prev,
                [activeTab]: [...prev[activeTab], ...newData]
            }));
        } catch (error) {
            console.error('Error in loadNotifications:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (notification: Notification) => {
        setNotifications(prev => ({
            unread: prev.unread.filter(n => n.id !== notification.id),
            read: [{ ...notification, is_read: true }, ...prev.read]
        }));
    };

    const handleTabChange = (value: 'unread' | 'read') => {
        setActiveTab(value);
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
            <NotificationList
                notifications={notifications[activeTab]}
                isLoading={isLoading}
                onMarkAsRead={handleMarkAsRead}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                unreadCount={notifications.unread.length}
                hasMore={hasMore}
                loaderRef={loader}
            />
        </div>
    );
}