import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface ProfileCardProps {
    user: {
        username: string;
        avatar?: string;
        bio?: string;
        posts: number;
        following: number;
        followers: number;
    };
    onLogout?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
    user,
    onLogout
}) => {
    return (
        <Card className="w-full sticky">
            <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                            {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm truncate font-semibold">@{user.username}</p>
                        <p className="text-gray-500 text-sm truncate">{user.bio}</p>
                    </div>

                    <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={onLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                    <div className="text-center">
                        <div className="font-bold">{user.posts.toLocaleString()}</div>
                        <div className="text-gray-500">Posts</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold">{user.following.toLocaleString()}</div>
                        <div className="text-gray-500">Following</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold">{user.followers.toLocaleString()}</div>
                        <div className="text-gray-500">Followers</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileCard