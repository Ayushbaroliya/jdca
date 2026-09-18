import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

// Base64 helper for VAPID key
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if push messaging is supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        setIsSubscribed(true);
      } else {
        // If they haven't subscribed and haven't permanently denied, show prompt after 3 seconds
        if (Notification.permission !== 'denied' && !localStorage.getItem('jdca_hide_push_prompt')) {
          setTimeout(() => setShowPrompt(true), 3000);
        }
      }
    } catch (err) {
      console.error('Error checking push subscription:', err);
    }
  };

  const handleSubscribe = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        
        const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        // Parse keys from subscription object
        const subJson = subscription.toJSON();
        
        // Save to Supabase
        const { error } = await supabase.from('push_subscriptions').insert({
          endpoint: subJson.endpoint,
          p256dh_key: subJson.keys.p256dh,
          auth_key: subJson.keys.auth
        });

        if (error && error.code !== '23505') { // Ignore unique constraint errors
          console.error('Supabase save error:', error);
        }

        setIsSubscribed(true);
        setShowPrompt(false);
      } else {
        setShowPrompt(false);
        localStorage.setItem('jdca_hide_push_prompt', 'true');
      }
    } catch (err) {
      console.error('Failed to subscribe:', err);
    }
  };

  if (!isSupported || isSubscribed || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-4 right-4 sm:left-auto sm:w-96 z-50"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="p-4 flex gap-4">
            <div className="bg-blue-100 rounded-full p-2 h-fit text-blue-600">
              <Bell size={20} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm">Enable Live Match Alerts</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Get instant notifications on your phone when wickets fall, sixes are hit, or a match ends!
              </p>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={handleSubscribe}
                  className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex-1 shadow-md shadow-blue-600/20"
                >
                  Turn On
                </button>
                <button 
                  onClick={() => {
                    setShowPrompt(false);
                    localStorage.setItem('jdca_hide_push_prompt', 'true');
                  }}
                  className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg flex-1"
                >
                  Not Now
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowPrompt(false)}
              className="text-slate-400 hover:text-slate-600 h-fit"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
