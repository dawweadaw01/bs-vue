import {request} from "@/util/service";
import type {appointment, appointmentRequest} from "@/api/appointment/types/appointment";

export function addAppointmentApi(data: appointment) {
    return request<ApiResponseData<any>>({
        url: "appointments/insertAppointments",
        method: "post",
        data
    })
}

export function getAppointmentListApi(data: appointmentRequest) {
    return request<ApiResponseData<any[]>>({
        url: "appointments/getAppointmentsByUserIdAndStatus",
        method: "post",
        data
    })
}

export function cancelAppointmentApi(id: number) {
    return request<ApiResponseData<any>>({
        url: "appointments/cancelAppointment",
        method: "post",
        contentType: "application/x-www-form-urlencoded",
        data: {id}
    })
}
