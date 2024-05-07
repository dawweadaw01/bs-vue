import {request} from "@/util/service";
import type {appointment} from "@/api/appointment/types/appointment";

export function addAppointmentApi(data: appointment){
    return request<ApiResponseData<any>>({
        url: "appointments/insertAppointments",
        method: "post",
        data
    })
}
