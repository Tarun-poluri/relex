"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
import { useAppDispatch } from "@/store/hooks"
import { createOwner, fetchOwners, updateOwner } from "@/store/actions/ownersactions"
import { Owner, OwnerLocation } from "@/app/types/ownerTypes"

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

type OwnerDetailsFormValues = Pick<Owner, 'firstName' | 'lastName' | 'email' | 'phone'>;

interface LocationFormValue extends Omit<OwnerLocation, 'id'> {
  id?: string;
}

interface LocationsFormValues {
  locations: LocationFormValue[];
}

interface OwnerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ownerToEdit?: Owner | null;
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

export function OwnerFormDialog({ open, onOpenChange, ownerToEdit }: OwnerFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetailsFormValues | null>(null)
  const dispatch = useAppDispatch()

  const isEditing = !!ownerToEdit;

  const ownerForm = useForm<OwnerDetailsFormValues>({
    defaultValues: isEditing ? {
      firstName: ownerToEdit.firstName,
      lastName: ownerToEdit.lastName,
      email: ownerToEdit.email,
      phone: ownerToEdit.phone,
    } : {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  const locationsForm = useForm<LocationsFormValues>({
    defaultValues: isEditing ? {
      locations: ownerToEdit.locations.map(loc => ({
        id: loc.id,
        name: loc.name,
        deviceIds: loc.deviceIds,
      })),
    } : {
      locations: [
        {
          name: "",
          deviceIds: [],
        },
      ],
    },
  })

  useEffect(() => {
    if (open) {
      if (isEditing && ownerToEdit) {
        ownerForm.reset({
          firstName: ownerToEdit.firstName,
          lastName: ownerToEdit.lastName,
          email: ownerToEdit.email,
          phone: ownerToEdit.phone,
        });
        locationsForm.reset({
          locations: ownerToEdit.locations.map(loc => ({
            id: loc.id,
            name: loc.name,
            deviceIds: loc.deviceIds,
          })),
        });
        setOwnerDetails({
          firstName: ownerToEdit.firstName,
          lastName: ownerToEdit.lastName,
          email: ownerToEdit.email,
          phone: ownerToEdit.phone,
        });
      } else {
        ownerForm.reset();
        locationsForm.reset();
        setOwnerDetails(null);
      }
      setCurrentStep(1);
    }
  }, [open, ownerToEdit, isEditing, ownerForm, locationsForm]);


  const handleOwnerDetailsSubmit = (data: OwnerDetailsFormValues) => {
    setOwnerDetails(data)
    setCurrentStep(2)
  }

  const handleLocationsSubmit = async (data: LocationsFormValues) => {
    setIsLoading(true)
    if (!ownerDetails) {
      console.error("Owner details are missing.")
      setIsLoading(false)
      return
    }

    try {
      if (isEditing && ownerToEdit) {
        const updatedOwner: Owner = {
          ...ownerToEdit,
          firstName: ownerDetails.firstName,
          lastName: ownerDetails.lastName,
          email: ownerDetails.email,
          phone: ownerDetails.phone,
          locations: data.locations.map(loc => ({
            id: loc.id || Math.random().toString(36).substr(2, 9),
            name: loc.name,
            deviceIds: loc.deviceIds,
          })),
        };
        await dispatch(updateOwner(updatedOwner));
      } else {
        const newOwner: Omit<Owner, 'id' | 'status' | 'createdAt'> = {
          firstName: ownerDetails.firstName,
          lastName: ownerDetails.lastName,
          email: ownerDetails.email,
          phone: ownerDetails.phone,
          locations: data.locations.map(loc => ({
            id: Math.random().toString(36).substr(2, 9),
            name: loc.name,
            deviceIds: loc.deviceIds,
          })),
        };
        await dispatch(createOwner(newOwner));
      }
      
      dispatch(fetchOwners());

      ownerForm.reset()
      locationsForm.reset()
      setOwnerDetails(null)
      setCurrentStep(1)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving owner:", error)
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
          <DialogTitle>{isEditing ? "Edit Owner" : "Create New Owner"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for this device owner." : "Add a new device owner to the RelaxFlow platform. Complete all steps to create the owner profile."}
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
                    rules={{
                      required: "First name is required",
                      minLength: { value: 2, message: "First name must be at least 2 characters" }
                    }}
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
                    rules={{
                      required: "Last name is required",
                      minLength: { value: 2, message: "Last name must be at least 2 characters" }
                    }}
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
                  rules={{
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  }}
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
                  rules={{
                    required: "Phone number is required",
                    minLength: { value: 10, message: "Phone number must be at least 10 characters" }
                  }}
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
                      rules={{
                        required: "Location name is required",
                        minLength: { value: 2, message: "Location name must be at least 2 characters" }
                      }}
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
                      rules={{
                        validate: (value: string[]) => value.length > 0 || "At least one device must be selected"
                      }}
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
                  {isEditing ? "Save Changes" : "Create Owner"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}