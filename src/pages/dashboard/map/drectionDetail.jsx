import React from "react";
import { useSelector } from "react-redux";
import maplibregl from "maplibre-gl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DIRECTION_ARROWS } from "../constants/TurnByTurnArrows";
import { useTheme } from "../theme-provider";

// Text-to-Speech Initialization
const synth = window.speechSynthesis;
let voices = [];

function populateVoiceList() {
  voices = synth.getVoices();
}

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}
populateVoiceList();

const speakText = (text) => {
  if (synth.speaking) {
    synth.cancel();
  }
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = voices.find((voice) => voice.lang === "en-US") || voices[0];
  synth.speak(utterThis);
};

const RenderDirectionDetail = ({ map, route }) => {
  const { waypoints } = useSelector((state) => state.map);
  const { theme } = useTheme();
  const [isMuted, setIsMuted] = React.useState(false);
  const steps = route?.legs[0]?.steps || [];

  const handleStepClick = (step) => {
    if (map) {
      map.flyTo({
        center: step.maneuver.location,
        essential: true,
        zoom: 15,
      });

      new maplibregl.Marker({ color: "red" })
        .setLngLat(step.maneuver.location)
        .addTo(map);

      new maplibregl.Popup({
        closeButton: false,
        className: "custom-popup",
      })
        .setLngLat(step.maneuver.location)
        .setHTML(
          `<div class="popup-content">
            <strong>Active Segment</strong><br/>
            ${step.name}
          </div>`
        )
        .setOffset([0, -30])
        .addTo(map);

      if (!isMuted) {
        speakText(
          `Proceed ${step.distance} meters, then turn ${step.maneuver.modifier} onto ${step.name}.`
        );
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synth.speaking) {
      synth.cancel();
    }
  };

  return (
    <Card className="z-20 flex flex-col shadow-lg rounded-lg w-full bg-background text-foreground border-border">
      <CardHeader className="p-4 border-b border-border">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              Via Africa Venue
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              <span>{((route?.duration || 0) / 60)?.toFixed(2)} min</span> (
              {((route?.distance || 0) / 1000)?.toFixed(2)} km)
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {/* Origin Step */}
            <div
              className="py-4 px-4  cursor-pointer transition-colors"
              onClick={() => handleStepClick(steps[0])}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent">
                  <span className="text-[#A91CD8] text-sm font-medium">1</span>
                </div>
                <div>
                  <span className="text-sm font-medium ">
                    Start at {steps[0]?.name}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {steps[0]?.distance}m
                  </div>
                </div>
                {!isMuted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(`Start at ${steps[0]?.name}`);
                    }}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Intermediate Steps */}
            {steps.map((step, idx) => {
              if (idx === 0 || idx === steps.length - 1) return null;

              return (
                <div
                  key={idx}
                  className={`py-4 px-4 dark:hover:bg-[#26645c] hover:bg-slate-200 cursor-pointer transition-colors ${waypoints.some(
                    (wp) =>
                      wp.latitude === step.maneuver.location[1] &&
                      wp.longitude === step.maneuver.location[0]
                  )
                    ? "bg-primary/10"
                    : ""
                    }`}
                  onClick={() => handleStepClick(step)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent">
                      <img
                        src={DIRECTION_ARROWS[step.maneuver.modifier]}
                        alt="Direction"
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        {/* {step.maneuver.instruction.replace(/<[^>]*>/g, "")} */}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {step.distance}m • {step.duration.toFixed(0)} sec
                      </div>
                    </div>
                    {!isMuted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(
                            `Proceed ${step.distance} meters, then turn ${step.maneuver.modifier} onto ${step.name}.`
                          );
                        }}
                      >
                        <Volume2
                          color={`${theme === "dark" ? "white" : "black"}`}
                          className="h-4 w-4 dark:hover:text-black"
                        />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Destination Step */}
            <div
              className="py-4 px-4 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleStepClick(steps[steps.length - 1])}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                  <span className="text-primary-foreground text-sm font-medium">
                    ✓
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">
                    Arrive at {steps[steps.length - 1]?.name}
                  </span>
                </div>
                {!isMuted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(`Arrive at ${steps[steps.length - 1]?.name}`);
                    }}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RenderDirectionDetail;