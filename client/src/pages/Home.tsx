import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, X, Check } from "lucide-react";

export default function Home() {
  const [showMusicWarning, setShowMusicWarning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showCommissionsModal, setShowCommissionsModal] = useState(false);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [showRobloxModal, setShowRobloxModal] = useState(false);

  const countriesQuery = (trpc as any).countries.list.useQuery();
  const statsQuery = (trpc as any).countries.stats.useQuery();

  // Check if first visit for music warning
  useEffect(() => {
    const hasSeenMusicWarning = localStorage.getItem("musicWarningShown");
    if (!hasSeenMusicWarning) {
      setShowMusicWarning(true);
      localStorage.setItem("musicWarningShown", "true");
    }
  }, []);

  const handleMusicContinue = () => {
    setShowMusicWarning(false);
    setIsMuted(false);
  };

  const handleMusicMute = () => {
    setShowMusicWarning(false);
  };

  const handleLeaveLink = (url: string) => {
    setPendingUrl(url);
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    if (!pendingUrl) return;
    setShowLeaveModal(false);
    if (pendingUrl.startsWith("mailto:")) {
      window.location.href = pendingUrl;
    } else {
      window.open(pendingUrl, "_blank", "noopener,noreferrer");
    }
    setPendingUrl(null);
  };

  const robloxAccounts = [
    { id: "7628397273", name: "Thuntc5813", group: "Main Account" },
    { id: "1905831731", name: "Minecraftlover_il", group: "Alternative Account" },
    { id: "1036029278", name: "MrRjc13", group: "Alternative Account" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      {/* Music Warning Modal */}
      <Dialog open={showMusicWarning} onOpenChange={setShowMusicWarning}>
        <DialogContent className="bg-black/80 border border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Music className="w-5 h-5" /> Music Warning
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">This website contains background music. Choose how you'd like to continue.</p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleMusicMute}
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              Mute audio & continue
            </Button>
            <Button
              onClick={handleMusicContinue}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leaving Site Modal */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent className="bg-black/80 border border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white">You're now leaving this site</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">
            All social medias are verified by the host of the domain before publish, therefore you're safe to leave.
            This message is to prevent you from being dragged to another site by accident.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowLeaveModal(false)}
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              Stay
            </Button>
            <Button
              onClick={handleConfirmLeave}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Continue to site
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Commissions Modal */}
      <Dialog open={showCommissionsModal} onOpenChange={setShowCommissionsModal}>
        <DialogContent className="bg-black/80 border border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Commissions</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">Sorry, I'm not accepting any commissions at the moment, check back at a later time.</p>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowCommissionsModal(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Roblox Accounts Modal */}
      <Dialog open={showRobloxModal} onOpenChange={setShowRobloxModal}>
        <DialogContent className="bg-black/80 border border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Roblox Accounts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {robloxAccounts.map((account) => (
              <div key={account.id}>
                <p className="text-sm text-gray-400 mb-2">{account.group}</p>
                <div
                  onClick={() => copyToClipboard(account.id)}
                  className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg cursor-pointer hover:bg-purple-500/20 transition flex items-center justify-between"
                >
                  <div>
                    <p className="text-gray-400 text-sm">{account.id}</p>
                    <p className="text-white">{account.name}</p>
                  </div>
                  <span className="text-gray-400">📋</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowRobloxModal(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Countries Modal */}
      <Dialog open={showCountriesModal} onOpenChange={setShowCountriesModal}>
        <DialogContent className="bg-black/80 border border-purple-500/30 backdrop-blur-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Countries Visited</DialogTitle>
          </DialogHeader>
          {statsQuery.data && (
            <p className="text-gray-300 text-sm">
              {statsQuery.data.visited} / {statsQuery.data.total} countries visited
            </p>
          )}
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-2">
              {countriesQuery.data?.map((country: any) => (
                <div
                  key={country.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-purple-500/10 transition"
                >
                  {country.visited === 1 ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-gray-300">{country.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowCountriesModal(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="w-full max-w-4xl">
        {/* Glassmorphism Container */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Profile Section */}
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1">
                <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center">
                  <span className="text-4xl">1</span>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">CrypticNoah</h1>
            <p className="text-xl text-gray-300 mb-6">Developer</p>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-gray-200 text-sm font-medium backdrop-blur-sm">
                Python
              </div>
              <div className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-gray-200 text-sm font-medium backdrop-blur-sm">
                Node.js
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {/* Discord */}
            <button
              onClick={() => handleLeaveLink("https://discord.com/users/YOUR_DISCORD_ID")}
              className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/30 transition backdrop-blur-sm"
              title="Discord"
            >
              <span className="text-xl">💜</span>
            </button>

            {/* TikTok */}
            <button
              onClick={() => handleLeaveLink("https://www.tiktok.com/@londonguardians")}
              className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/30 transition backdrop-blur-sm"
              title="TikTok"
            >
              <span className="text-xl">🎵</span>
            </button>

            {/* X */}
            <button
              onClick={() => handleLeaveLink("https://x.com/BloxBriefs")}
              className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/30 transition backdrop-blur-sm"
              title="X"
            >
              <span className="text-xl">𝕏</span>
            </button>

            {/* Roblox */}
            <button
              onClick={() => setShowRobloxModal(true)}
              className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/30 transition backdrop-blur-sm"
              title="Roblox"
            >
              <span className="text-xl">🎮</span>
            </button>

            {/* Email */}
            <button
              onClick={() => handleLeaveLink("mailto:noah@noahrblx.com?subject=Hello%20CrypticNoah&body=Hey%20CrypticNoah%2C%0A%0A")}
              className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/30 transition backdrop-blur-sm"
              title="Email"
            >
              <span className="text-xl">✉️</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowCommissionsModal(true)}
              className="px-6 py-3 rounded-full bg-purple-500/20 border border-purple-500/30 text-white font-semibold hover:bg-purple-500/30 transition backdrop-blur-sm"
            >
              Commissions
            </button>
            <button
              onClick={() => setShowCountriesModal(true)}
              className="px-6 py-3 rounded-full bg-purple-500/20 border border-purple-500/30 text-white font-semibold hover:bg-purple-500/30 transition backdrop-blur-sm"
            >
              Countries!
            </button>
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-white text-sm font-medium hover:bg-purple-500/30 transition backdrop-blur-sm flex items-center gap-2"
          >
            <Music className="w-4 h-4" />
            {isMuted ? "Muted" : "Sound"}
          </button>
        </div>
      </div>
    </div>
  );
}
