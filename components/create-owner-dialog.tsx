"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, ArrowLeft, ArrowRight, Plus, X, Search, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"

// Available products for Device ID dropdown
const availableProducts = [
  { id: "RFB-001", name: "RelaxFlow Sound Bowl Pro" },
  { id: "HH-PRO-2024", name: "Harmony Headphones" },
  { id: "VM-2024", name: "Vibration Therapy Mat" },
  { id: "MC-SET-01", name: "Meditation Cushion Set" },
  { id: "RFA-PREMIUM", name: "RelaxFlow Mobile App Premium" },
  { id: "TB-2024", name: "Therapy Bowl Advanced" },
  { id: "SC-PRO", name: "Sound Cushion Pro" },
  { id: "VH-LITE", name: "Vibration Headset Lite" },
  { id: "RF-MAT-XL", name: "RelaxFlow Mat XL" },
  { id: "ZEN-001", name: "Zen Meditation Kit" },
]

const ownerDetailsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
})

const locationSchema = z.object({
  name: z.string().min(2, "Location name must be at least 2 characters"),
  deviceIds: z.array(z.string()).min(1, "At least one device must be selected"),
})

const locationsSchema = z.object({
  locations: z.array(locationSchema).min(1, "At least one location is required"),
})

type OwnerDetailsFormValues = z.infer<typeof ownerDetailsSchema>
type LocationsFormValues = z.infer<typeof locationsSchema>

interface CreateOwnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MultiSelectDeviceProps {
  selectedDevices: string[]
  onDevicesChange: (devices: string[]) => void
  placeholder?: string
}

function MultiSelectDevice({
  selectedDevices,
  onDevicesChange,
  placeholder = "Select devices...",
}: MultiSelectDeviceProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (deviceId: string, event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()

    const newSelectedDevices = selectedDevices.includes(deviceId)
      ? selectedDevices.filter((id) => id !== deviceId)
      : [...selectedDevices, deviceId]

    onDevicesChange(newSelectedDevices)
  }

  const handleRemove = (deviceId: string) => {
    onDevicesChange(selectedDevices.filter((id) => id !== deviceId))
  }

  const handleSelectAll = (event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()

    if (selectedDevices.length === availableProducts.length) {
      onDevicesChange([])
    } else {
      onDevicesChange(availableProducts.map((p) => p.id))
    }
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedDevices.length > 0 ? (
              <span className="text-left">
                {selectedDevices.length === 1
                  ? `${selectedDevices[0]} selected`
                  : `${selectedDevices.length} devices selected`}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search devices by ID or name..." />
            <CommandList>
              <CommandEmpty>No devices found.</CommandEmpty>
              <CommandGroup>
                <div
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground font-medium"
                  onClick={handleSelectAll}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedDevices.length === availableProducts.length ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {selectedDevices.length === availableProducts.length ? "Deselect All" : "Select All"}
                </div>
                <div className="border-t my-1" />
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative flex cursor-default select-none items-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={(e) => handleSelect(product.id, e)}
                  >
                    <Check
                      className={`mt-0.5 h-4 w-4 ${selectedDevices.includes(product.id) ? "opacity-100" : "opacity-0"}`}
                    />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm">{product.id}</span>
                      <span className="text-xs text-muted-foreground">{product.name}</span>
                    </div>
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected devices display */}
      {selectedDevices.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Selected devices ({selectedDevices.length}):</div>
          <div className="flex flex-wrap gap-2">
            {selectedDevices.map((deviceId) => {
              const product = availableProducts.find((p) => p.id === deviceId)
              return (
                <Badge key={deviceId} variant="secondary" className="gap-1 pr-1">
                  <span className="font-medium">{deviceId}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(deviceId)}
                    className="ml-1 hover:text-red-600 rounded-sm p-0.5 hover:bg-red-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function CreateOwnerDialog({ open, onOpenChange }: CreateOwnerDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetailsFormValues | null>(null)

  const ownerForm = useForm<OwnerDetailsFormValues>({
    resolver: zodResolver(ownerDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  const locationsForm = useForm<LocationsFormValues>({
    resolver: zodResolver(locationsSchema),
    defaultValues: {
      locations: [
        {
          name: "",
          deviceIds: [],
        },
      ],
    },
  })

  const handleOwnerDetailsSubmit = (data: OwnerDetailsFormValues) => {
    setOwnerDetails(data)
    setCurrentStep(2)
  }

  const handleLocationsSubmit = async (data: LocationsFormValues) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Creating owner:", { ...ownerDetails, ...data })

      // Reset forms and close dialog
      ownerForm.reset()
      locationsForm.reset()
      setOwnerDetails(null)
      setCurrentStep(1)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating owner:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addLocation = () => {
    const currentLocations = locationsForm.getValues("locations")
    locationsForm.setValue("locations", [
      ...currentLocations,
      {
        name: "",
        deviceIds: [],
      },
    ])
  }

  const removeLocation = (index: number) => {
    const currentLocations = locationsForm.getValues("locations")
    if (currentLocations.length > 1) {
      locationsForm.setValue(
        "locations",
        currentLocations.filter((_, i) => i !== index),
      )
    }
  }

  const handleDevicesChange = (locationIndex: number, devices: string[]) => {
    const currentLocations = locationsForm.getValues("locations")
    currentLocations[locationIndex].deviceIds = devices
    locationsForm.setValue("locations", currentLocations)
    locationsForm.trigger(`locations.${locationIndex}.deviceIds`)
  }

  const handleClose = () => {
    ownerForm.reset()
    locationsForm.reset()
    setOwnerDetails(null)
    setCurrentStep(1)
    onOpenChange(false)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const progress = (currentStep / 2) * 100

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Owner</DialogTitle>
          <DialogDescription>
            Add a new device owner to the RelaxFlow platform. Complete all steps to create the owner profile.
          </DialogDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of 2</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </DialogHeader>

        {currentStep === 1 && (
          <Form {...ownerForm}>
            <form onSubmit={ownerForm.handleSubmit(handleOwnerDetailsSubmit)} className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Owner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={ownerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={ownerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={ownerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ownerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {currentStep === 2 && (
          <Form {...locationsForm}>
            <form onSubmit={locationsForm.handleSubmit(handleLocationsSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Location Management</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addLocation} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Location
                  </Button>
                </div>

                {locationsForm.watch("locations").map((location, locationIndex) => (
                  <div key={locationIndex} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Location {locationIndex + 1}</h4>
                      {locationsForm.watch("locations").length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLocation(locationIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={locationsForm.control}
                      name={`locations.${locationIndex}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={locationsForm.control}
                      name={`locations.${locationIndex}.deviceIds`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device IDs</FormLabel>
                          <FormControl>
                            <MultiSelectDevice
                              selectedDevices={field.value}
                              onDevicesChange={(devices) => handleDevicesChange(locationIndex, devices)}
                              placeholder="Search and select multiple devices..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Owner
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
