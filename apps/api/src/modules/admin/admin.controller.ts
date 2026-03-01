import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.adminService.getUsers(parseInt(page), parseInt(limit));
  }

  @Get('tenants')
  getTenants(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.adminService.getTenants(parseInt(page), parseInt(limit));
  }

  @Get('audit-logs')
  getAuditLogs(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.adminService.getAuditLogs(parseInt(page), parseInt(limit));
  }
}
